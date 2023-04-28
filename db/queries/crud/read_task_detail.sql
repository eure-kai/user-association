SELECT
    taskId, taskName, description, categoryName, 
    tasks.categoryId as categoryId,
    DATE_FORMAT(taskDate, "%m/%d/%y (%W)") AS taskDateClean,
    DATE_FORMAT(taskDate, "%Y-%m-%d") AS taskDateForms, 
    TIME_FORMAT(startTime, "%h:%i %p") AS startTimeClean,
    TIME_FORMAT(startTime, "%T") AS startTimeForms,
    TIME_FORMAT(endTime, "%h:%i %p") AS endTimeClean,
    TIME_FORMAT(endTime, "%T") AS endTimeForms,
    location
FROM tasks 
JOIN categories
    ON tasks.categoryId = categories.categoryId
WHERE 
    tasks.taskId = ?
AND
    tasks.userId = ?;