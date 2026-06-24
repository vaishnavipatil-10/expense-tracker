package com.vaishnavi.expense_tracker.controller;

import com.vaishnavi.expense_tracker.model.Expense;
import com.vaishnavi.expense_tracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    // GET all expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // POST - add new expense
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseRepository.save(expense);
    }

    // PUT - edit expense
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense updated) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        existing.setTitle(updated.getTitle());
        existing.setAmount(updated.getAmount());
        existing.setCategory(updated.getCategory());
        existing.setNote(updated.getNote());
        existing.setDate(updated.getDate());
        return expenseRepository.save(existing);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
        return "Expense deleted";
    }

    // GET by category
    @GetMapping("/category/{category}")
    public List<Expense> getByCategory(@PathVariable String category) {
        return expenseRepository.findByCategory(category);
    }

    // GET by date range
    @GetMapping("/range")
    public List<Expense> getByDateRange(
            @RequestParam String start,
            @RequestParam String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return expenseRepository.findByDateBetween(startDate, endDate);
    }

    // GET monthly summary
    @GetMapping("/summary/{year}/{month}")
    public Map<String, Object> getMonthlySummary(
            @PathVariable int year,
            @PathVariable int month) {

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Expense> expenses = expenseRepository.findByDateBetween(start, end);

        double total = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        Map<String, Double> byCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)
                ));

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("month", year + "-" + String.format("%02d", month));
        summary.put("totalExpenses", expenses.size());
        summary.put("totalAmount", total);
        summary.put("byCategory", byCategory);

        return summary;
    }
}
