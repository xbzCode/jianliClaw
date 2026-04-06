-- ============================================
-- 数据库初始化脚本
-- 用途：创建数据库用户和数据库
-- 使用方法：以 postgres 超级用户身份连接后执行
-- ============================================

-- 1. 创建用户（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'jianliclaw') THEN
        CREATE USER jianliclaw WITH PASSWORD 'jianliclaw123';
        RAISE NOTICE '用户 jianliclaw 已创建';
    ELSE
        RAISE NOTICE '用户 jianliclaw 已存在';
    END IF;
END
$$;

-- 2. 创建数据库（如果不存在）
SELECT 'CREATE DATABASE jianliclaw OWNER jianliclaw'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'jianliclaw')\gexec

-- 3. 授予权限
GRANT ALL PRIVILEGES ON DATABASE jianliclaw TO jianliclaw;

-- 4. 连接到 jianliclaw 数据库并设置权限
\c jianliclaw

-- 授予 public schema 所有权限
GRANT ALL ON SCHEMA public TO jianliclaw;

-- 启用 pgvector 扩展（如果需要）
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建更新时间函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 验证设置
\echo '数据库设置完成！'
\echo '数据库: jianliclaw'
\echo '用户: jianliclaw'
\echo '密码: jianliclaw123'
