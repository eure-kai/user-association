SELECT
    taskId, taskName, description, categoryName, 
    tasks.categoryId as categoryId,
    DATE_FORMAT(taskDate, "%m/%d/%y (%W)") AS taskDateFormatted, 
    TIME_FORMAT(startTime, "%h:%i %p") AS startTimeFormatted,
    TIME_FORMAT(endTime, "%h:%i %p") AS endTimeFormatted,
    location
FROM tasks 
JOIN categories
    ON tasks.categoryId = categories.categoryId
WHERE
    tasks.userid = ?
ORDER BY tasks.taskId DESC;