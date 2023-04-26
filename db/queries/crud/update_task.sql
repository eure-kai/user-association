UPDATE
    tasks
SET
    taskName = ?,
    description = ?,
    categoryId = ?,
    taskDate = ?,
    startTime = ?,
    endTime = ?,
    location = ?
WHERE
    taskId = ?
AND
    userId = ?;