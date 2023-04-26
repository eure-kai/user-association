DELETE
FROM
    tasks
WHERE
    taskId = ?
AND
    userId = ?;