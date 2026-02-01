-- ============================================
-- NatureQuest - Azure SQL Database Schema
-- ============================================
-- Execute este script no Azure SQL Database
-- para criar todas as tabelas necessárias

-- ============================================
-- Tabela: Users (Alunos e Professores)
-- ============================================
CREATE TABLE Users (
    id NVARCHAR(50) PRIMARY KEY,                    -- Azure AD Object ID
    email NVARCHAR(255) NOT NULL UNIQUE,
    name NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student', 'admin')),
    avatar NVARCHAR(10),
    createdAt DATETIME2 DEFAULT GETDATE(),
    lastLogin DATETIME2,
    isActive BIT DEFAULT 1,
    
    -- Campos específicos para alunos
    classId NVARCHAR(50) NULL,                      -- FK para Classes
    guildId NVARCHAR(50) NULL,                      -- FK para Guilds
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    xpToNextLevel INT DEFAULT 100,
    totalXp INT DEFAULT 0,
    
    -- Estatísticas do personagem
    strength INT DEFAULT 5,
    intelligence INT DEFAULT 5,
    wisdom INT DEFAULT 5,
    dexterity INT DEFAULT 5,
    constitution INT DEFAULT 5,
    charisma INT DEFAULT 5,
    
    -- Índices
    INDEX IX_Users_ClassId (classId),
    INDEX IX_Users_GuildId (guildId),
    INDEX IX_Users_Email (email)
);

-- ============================================
-- Tabela: Classes (Turmas)
-- ============================================
CREATE TABLE Classes (
    id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    teacherId NVARCHAR(50) NOT NULL,
    inviteCode NVARCHAR(20) NOT NULL UNIQUE,
    createdAt DATETIME2 DEFAULT GETDATE(),
    isActive BIT DEFAULT 1,
    
    CONSTRAINT FK_Classes_Teacher FOREIGN KEY (teacherId) REFERENCES Users(id),
    INDEX IX_Classes_TeacherId (teacherId),
    INDEX IX_Classes_InviteCode (inviteCode)
);

-- ============================================
-- Tabela: Guilds
-- ============================================
CREATE TABLE Guilds (
    id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    classId NVARCHAR(50) NOT NULL,
    leaderId NVARCHAR(50) NOT NULL,
    emblem NVARCHAR(50) NOT NULL,
    color NVARCHAR(7) NOT NULL,                     -- Hex color (#RRGGBB)
    description NVARCHAR(500),
    totalXp INT DEFAULT 0,
    level INT DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_Guilds_Class FOREIGN KEY (classId) REFERENCES Classes(id) ON DELETE CASCADE,
    CONSTRAINT FK_Guilds_Leader FOREIGN KEY (leaderId) REFERENCES Users(id),
    INDEX IX_Guilds_ClassId (classId)
);

-- ============================================
-- Tabela: GuildMembers (Relação N:N)
-- ============================================
CREATE TABLE GuildMembers (
    guildId NVARCHAR(50) NOT NULL,
    userId NVARCHAR(50) NOT NULL,
    joinedAt DATETIME2 DEFAULT GETDATE(),
    
    PRIMARY KEY (guildId, userId),
    CONSTRAINT FK_GuildMembers_Guild FOREIGN KEY (guildId) REFERENCES Guilds(id) ON DELETE CASCADE,
    CONSTRAINT FK_GuildMembers_User FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- ============================================
-- Tabela: Missions (Missões)
-- ============================================
CREATE TABLE Missions (
    id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    type NVARCHAR(20) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'special')),
    subject NVARCHAR(20) NOT NULL CHECK (subject IN ('biology', 'chemistry', 'physics', 'geology', 'ecology', 'general')),
    difficulty NVARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
    xpReward INT NOT NULL DEFAULT 0,
    classId NVARCHAR(50) NOT NULL,
    createdBy NVARCHAR(50) NOT NULL,
    createdAt DATETIME2 DEFAULT GETDATE(),
    deadline DATETIME2 NULL,
    isActive BIT DEFAULT 1,
    
    CONSTRAINT FK_Missions_Class FOREIGN KEY (classId) REFERENCES Classes(id) ON DELETE CASCADE,
    CONSTRAINT FK_Missions_Creator FOREIGN KEY (createdBy) REFERENCES Users(id),
    INDEX IX_Missions_ClassId (classId),
    INDEX IX_Missions_Type (type),
    INDEX IX_Missions_Subject (subject)
);

-- ============================================
-- Tabela: MissionRequirements
-- ============================================
CREATE TABLE MissionRequirements (
    id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    missionId NVARCHAR(50) NOT NULL,
    type NVARCHAR(20) NOT NULL CHECK (type IN ('quiz', 'assignment', 'practical', 'research')),
    description NVARCHAR(MAX) NOT NULL,
    minScore INT NULL,
    
    CONSTRAINT FK_Requirements_Mission FOREIGN KEY (missionId) REFERENCES Missions(id) ON DELETE CASCADE,
    INDEX IX_Requirements_MissionId (missionId)
);

-- ============================================
-- Tabela: MissionCompletions
-- ============================================
CREATE TABLE MissionCompletions (
    id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    missionId NVARCHAR(50) NOT NULL,
    userId NVARCHAR(50) NOT NULL,
    completedAt DATETIME2 DEFAULT GETDATE(),
    score INT NULL,
    xpEarned INT NOT NULL DEFAULT 0,
    
    CONSTRAINT FK_Completions_Mission FOREIGN KEY (missionId) REFERENCES Missions(id),
    CONSTRAINT FK_Completions_User FOREIGN KEY (userId) REFERENCES Users(id),
    UNIQUE (missionId, userId),
    INDEX IX_Completions_UserId (userId),
    INDEX IX_Completions_MissionId (missionId)
);

-- ============================================
-- Tabela: Items (Itens do jogo)
-- ============================================
CREATE TABLE Items (
    id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    type NVARCHAR(20) NOT NULL CHECK (type IN ('weapon', 'armor', 'head', 'accessory', 'consumable', 'cosmetic', 'material')),
    rarity NVARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    icon NVARCHAR(10) NOT NULL,
    indigenousName NVARCHAR(255),
    indigenousMeaning NVARCHAR(255),
    levelRequirement INT DEFAULT 1,
    tradable BIT DEFAULT 1,
    maxStack INT DEFAULT 1,
    
    -- Stats
    strengthBonus INT DEFAULT 0,
    intelligenceBonus INT DEFAULT 0,
    wisdomBonus INT DEFAULT 0,
    dexterityBonus INT DEFAULT 0,
    constitutionBonus INT DEFAULT 0,
    charismaBonus INT DEFAULT 0,
    
    isActive BIT DEFAULT 1,
    INDEX IX_Items_Type (type),
    INDEX IX_Items_Rarity (rarity)
);

-- ============================================
-- Tabela: Inventory (Inventário dos usuários)
-- ============================================
CREATE TABLE Inventory (
    id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    userId NVARCHAR(50) NOT NULL,
    itemId NVARCHAR(50) NOT NULL,
    quantity INT DEFAULT 1,
    acquiredAt DATETIME2 DEFAULT GETDATE(),
    equipped BIT DEFAULT 0,
    
    CONSTRAINT FK_Inventory_User FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT FK_Inventory_Item FOREIGN KEY (itemId) REFERENCES Items(id),
    INDEX IX_Inventory_UserId (userId),
    INDEX IX_Inventory_ItemId (itemId)
);

-- ============================================
-- Tabela: Punishments (Punições)
-- ============================================
CREATE TABLE Punishments (
    id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    userId NVARCHAR(50) NOT NULL,
    type NVARCHAR(20) NOT NULL CHECK (type IN ('warning', 'xp_loss', 'item_loss', 'temporary_ban')),
    reason NVARCHAR(MAX) NOT NULL,
    xpLoss INT NULL,
    itemLoss NVARCHAR(MAX),                       -- JSON array de item IDs
    duration INT NULL,                            -- Em minutos
    givenBy NVARCHAR(50) NOT NULL,
    givenAt DATETIME2 DEFAULT GETDATE(),
    expiresAt DATETIME2 NULL,
    
    CONSTRAINT FK_Punishments_User FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT FK_Punishments_GivenBy FOREIGN KEY (givenBy) REFERENCES Users(id),
    INDEX IX_Punishments_UserId (userId)
);

-- ============================================
-- Tabela: Achievements (Conquistas)
-- ============================================
CREATE TABLE Achievements (
    id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    icon NVARCHAR(10) NOT NULL,
    xpReward INT DEFAULT 0,
    requirementType NVARCHAR(20) NOT NULL,
    requirementValue INT NOT NULL,
    requirementSubject NVARCHAR(20) NULL,
    isActive BIT DEFAULT 1
);

-- ============================================
-- Tabela: UserAchievements
-- ============================================
CREATE TABLE UserAchievements (
    userId NVARCHAR(50) NOT NULL,
    achievementId NVARCHAR(50) NOT NULL,
    earnedAt DATETIME2 DEFAULT GETDATE(),
    
    PRIMARY KEY (userId, achievementId),
    CONSTRAINT FK_UserAchievements_User FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT FK_UserAchievements_Achievement FOREIGN KEY (achievementId) REFERENCES Achievements(id)
);

-- ============================================
-- Tabela: ActivityLogs
-- ============================================
CREATE TABLE ActivityLogs (
    id NVARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    type NVARCHAR(50) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    userId NVARCHAR(50) NOT NULL,
    userName NVARCHAR(255) NOT NULL,
    timestamp DATETIME2 DEFAULT GETDATE(),
    metadata NVARCHAR(MAX),                       -- JSON para dados adicionais
    
    INDEX IX_ActivityLogs_Timestamp (timestamp),
    INDEX IX_ActivityLogs_UserId (userId),
    INDEX IX_ActivityLogs_Type (type)
);

-- ============================================
-- Dados Iniciais (Seed)
-- ============================================

-- Itens iniciais
INSERT INTO Items (id, name, description, type, rarity, icon, indigenousName, indigenousMeaning, stats) VALUES
('item-1', 'Machado de Bronze', 'Um machado forjado em bronze antigo, símbolo de força.', 'weapon', 'rare', '🪓', 'Takware', 'Machado de guerra Tupi', '{"strength": 5, "constitution": 2}'),
('item-2', 'Máscara Xamânica', 'Máscara usada em rituais de conhecimento.', 'accessory', 'epic', '🎭', 'Karowá', 'Máscara ritual', '{"intelligence": 8, "wisdom": 5}'),
('item-3', 'Cocar de Penas Douradas', 'Cocar cerimonial que confere carisma e sabedoria.', 'head', 'legendary', '👑', 'Akará', 'Cocar de penas', '{"charisma": 10, "wisdom": 5, "intelligence": 3}'),
('item-4', 'Poção de Sabedoria', 'Elixir que aumenta temporariamente a inteligência.', 'consumable', 'uncommon', '🧪', NULL, NULL, NULL),
('item-5', 'Armadura de Couro', 'Proteção básica de couro reforçado.', 'armor', 'common', '🛡️', NULL, NULL, '{"constitution": 3}');

-- ============================================
-- Stored Procedures
-- ============================================

-- Procedure: Adicionar XP ao usuário
CREATE PROCEDURE sp_AddUserXP
    @userId NVARCHAR(50),
    @xpAmount INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @currentXp INT, @xpToNext INT, @currentLevel INT;
    
    SELECT @currentXp = xp, @xpToNext = xpToNextLevel, @currentLevel = level
    FROM Users WHERE id = @userId;
    
    SET @currentXp = @currentXp + @xpAmount;
    
    -- Level up check
    WHILE @currentXp >= @xpToNext
    BEGIN
        SET @currentXp = @currentXp - @xpToNext;
        SET @currentLevel = @currentLevel + 1;
        SET @xpToNext = CAST(@xpToNext * 1.5 AS INT);
    END
    
    UPDATE Users
    SET xp = @currentXp,
        xpToNextLevel = @xpToNext,
        level = @currentLevel,
        totalXp = totalXp + @xpAmount
    WHERE id = @userId;
END;

-- Procedure: Obter leaderboard
CREATE PROCEDURE sp_GetLeaderboard
    @classId NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ROW_NUMBER() OVER (ORDER BY totalXp DESC) as rank,
        id as studentId,
        name as studentName,
        avatar,
        level,
        totalXp as xp,
        (SELECT name FROM Guilds WHERE id = u.guildId) as guildName
    FROM Users u
    WHERE role = 'student'
    AND (@classId IS NULL OR classId = @classId)
    AND isActive = 1
    ORDER BY totalXp DESC;
END;

-- ============================================
-- Views
-- ============================================

-- View: Resumo da turma
CREATE VIEW vw_ClassSummary AS
SELECT 
    c.id as classId,
    c.name as className,
    c.inviteCode,
    (SELECT COUNT(*) FROM Users WHERE classId = c.id AND role = 'student' AND isActive = 1) as studentCount,
    (SELECT COUNT(*) FROM Missions WHERE classId = c.id AND isActive = 1) as missionCount,
    (SELECT COUNT(*) FROM Guilds WHERE classId = c.id) as guildCount
FROM Classes c
WHERE c.isActive = 1;

-- View: Estatísticas do aluno
CREATE VIEW vw_StudentStats AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.level,
    u.xp,
    u.xpToNextLevel,
    u.totalXp,
    c.name as className,
    g.name as guildName,
    (SELECT COUNT(*) FROM MissionCompletions WHERE userId = u.id) as completedMissions,
    (SELECT COUNT(*) FROM Inventory WHERE userId = u.id) as itemCount
FROM Users u
LEFT JOIN Classes c ON u.classId = c.id
LEFT JOIN Guilds g ON u.guildId = g.id
WHERE u.role = 'student' AND u.isActive = 1;
