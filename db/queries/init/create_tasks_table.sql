CREATE TABLE tasks (
    taskId INT NOT NULL AUTO_INCREMENT,
    taskName VARCHAR(45) NOT NULL,
    description VARCHAR(150) NULL,
    categoryId INT NOT NULL,
    taskDate DATE NULL,
    startTime TIME NULL,
    endTime TIME NULL,
    location VARCHAR(45) NULL,
    userId VARCHAR(255) NULL,
    PRIMARY KEY (taskId),
    INDEX taskCategory_idx (categoryId ASC),
    CONSTRAINT taskCategory
        FOREIGN KEY (categoryId)
        REFERENCES categories (categoryId)
        ON DELETE RESTRICT
        ON UPDATE CASCADE);