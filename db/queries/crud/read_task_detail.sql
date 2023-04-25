SELECT
    taskId, taskName, description, categoryName, 
    tasks.categoryId as categoryId,
    DATE_FORMAT(taskDate, "%m/%d/%y (%W)") AS taskDateFormatted, 
    TIME_FORMAT(startTime, "%r") AS startTimeFormatted,
    TIME_FORMAT(endTime, "%r") AS endTimeFormatted,
    location
FROM tasks 
JOIN categories
    ON tasks.categoryId = categories.categoryId
WHERE 
    tasks.taskId = ?
AND
    tasks.userId = ?;