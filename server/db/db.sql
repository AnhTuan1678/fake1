-- ============================
-- TẠO CƠ SỞ DỮ LIỆU
-- ============================
DROP TABLE IF EXISTS user_progress CASCADE;

DROP TABLE IF EXISTS user_bookshelf CASCADE;

DROP TABLE IF EXISTS chapters CASCADE;

DROP TABLE IF EXISTS books CASCADE;

DROP TABLE IF EXISTS users CASCADE;

-- ============================
-- BẢNG USERS (tài khoản)
-- ============================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    personal_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- BẢNG BOOKS (sách)
-- ============================
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    publish_date DATE,
    status VARCHAR(50) DEFAULT 'Đang ra', -- Hoàn thành / Tạm ngưng...
    chapter_count INT DEFAULT 0,
    word_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- BẢNG CHAPTERS (chương)
-- ============================
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    author_note TEXT,
    CONTENT TEXT NOT NULL,
    word_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- BẢNG USER_BOOKSHELF (tủ sách)
-- ============================
CREATE TABLE user_bookshelf (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    book_id INT REFERENCES books (id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, book_id)
);

-- ============================
-- BẢNG USER_PROGRESS (tiến độ đọc)
-- ============================
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    book_id INT REFERENCES books (id) ON DELETE CASCADE,
    last_chapter_index INT REFERENCES chapters (id) ON DELETE SET NULL,
    progress_percent NUMERIC(5, 2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, book_id)
);

-- ============================
-- TRIGGER: Đếm số từ trong chương
-- ============================
CREATE OR REPLACE FUNCTION update_chapter_wordcount()
RETURNS TRIGGER AS $$
DECLARE
    word_total INT;
BEGIN
    word_total := COALESCE(array_length(regexp_split_to_array(NEW.content, '\s+'), 1), 0);
    NEW.word_count := word_total;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_chapter_wordcount
BEFORE INSERT OR UPDATE ON chapters
FOR EACH ROW
EXECUTE FUNCTION update_chapter_wordcount();

-- ============================
-- TRIGGER: Cập nhật thống kê sách khi thay đổi chương
-- ============================
CREATE OR REPLACE FUNCTION update_book_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Khi thêm chương
    IF TG_OP = 'INSERT' THEN
        UPDATE books
        SET chapter_count = chapter_count + 1,
            word_count = word_count + NEW.word_count,
            updated_at = NOW()
        WHERE id = NEW.book_id;
    END IF;

    -- Khi xóa chương
    IF TG_OP = 'DELETE' THEN
        UPDATE books
        SET chapter_count = chapter_count - 1,
            word_count = word_count - OLD.word_count,
            updated_at = NOW()
        WHERE id = OLD.book_id;
    END IF;

    -- Khi sửa chương (nội dung thay đổi)
    IF TG_OP = 'UPDATE' THEN
        UPDATE books
        SET word_count = word_count - OLD.word_count + NEW.word_count,
            updated_at = NOW()
        WHERE id = NEW.book_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_book_after_chapter
AFTER INSERT OR UPDATE OR DELETE ON chapters
FOR EACH ROW
EXECUTE FUNCTION update_book_stats();

-- ============================
-- TEST DỮ LIỆU
-- ============================
INSERT INTO
    users (
        username,
        email,
        password_hash
    )
VALUES (
        'admin',
        'admin@example.com',
        'hashed_pw'
    );

INSERT INTO
    books (
        title,
        author,
        description,
        publish_date
    )
VALUES (
        'Thơ Chi',
        'Tác giả A',
        'Một tác phẩm giả định',
        '2025-01-01'
    );

INSERT INTO
    chapters (book_id, title, CONTENT)
VALUES (
        1,
        'Chương 1',
        'Đây là nội dung chương đầu tiên có khoảng mười từ để test trigger.'
    );

INSERT INTO user_bookshelf (user_id, book_id) VALUES (1, 1);

SELECT * FROM books;

SELECT * FROM chapters;