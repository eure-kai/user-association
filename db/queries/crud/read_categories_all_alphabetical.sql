SELECT
    categoryId, categoryName
FROM
    categories
WHERE
    userId = ?
ORDER BY
    categoryName ASC;