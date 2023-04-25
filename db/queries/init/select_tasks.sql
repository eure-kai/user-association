SELECT *
FROM tasks
JOIN categories
    ON tasks.categoryId = categories.categoryId 
ORDER BY
    tasks.taskId;