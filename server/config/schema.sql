CREATE TABLE IF NOT EXISTS users (
  id                    INT PRIMARY KEY AUTO_INCREMENT,
  email                 VARCHAR(255) NOT NULL UNIQUE,
  password              VARCHAR(255) NOT NULL,
  user_type             ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  failed_login_attempts INT NOT NULL DEFAULT 0,
  locked_until          DATETIME DEFAULT NULL,
  last_login            DATETIME DEFAULT NULL,
  last_failed_login     DATETIME DEFAULT NULL,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id                          INT PRIMARY KEY AUTO_INCREMENT,
  user_id                     INT NOT NULL UNIQUE,
  full_name                   VARCHAR(100) NOT NULL,
  matric_no                   VARCHAR(15) NOT NULL UNIQUE,
  display_name                VARCHAR(50) DEFAULT NULL,
  faculty                     VARCHAR(150) DEFAULT NULL,
  year_of_study               INT DEFAULT NULL,
  nationality                 VARCHAR(50) DEFAULT NULL,
  bio                         TEXT DEFAULT NULL,
  profile_picture             VARCHAR(255) DEFAULT NULL,
  account_status              ENUM('active', 'suspended', 'reinstated') NOT NULL DEFAULT 'active',
  email_verified              BOOLEAN NOT NULL DEFAULT FALSE,
  email_verification_token    VARCHAR(255) DEFAULT NULL,
  email_token_expiry          DATETIME DEFAULT NULL,
  reset_token                 VARCHAR(255) DEFAULT NULL,
  reset_token_expiry          DATETIME DEFAULT NULL,
  created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admins (
  id      INT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS conversations (
  id                  INT PRIMARY KEY AUTO_INCREMENT,
  listing_id          INT DEFAULT NULL,
  participant_one_id  INT NOT NULL,
  participant_two_id  INT NOT NULL,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status              VARCHAR(20) NOT NULL DEFAULT 'active',
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL,
  FOREIGN KEY (participant_one_id) REFERENCES users(id),
  FOREIGN KEY (participant_two_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id       INT NOT NULL,
  content         TEXT NOT NULL,
  sent_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  message_type    VARCHAR(20) NOT NULL DEFAULT 'text',
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS room_preferences (
  id                    INT PRIMARY KEY AUTO_INCREMENT,
  user_id               INT NOT NULL UNIQUE,
  max_budget            DECIMAL(8,2) DEFAULT NULL,
  room_type             VARCHAR(50) DEFAULT NULL,
  max_distance_km       FLOAT DEFAULT NULL,
  furnishing_preference VARCHAR(20) DEFAULT NULL,
  bathroom_type         VARCHAR(20) DEFAULT NULL,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recommendation_sessions (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  user_id       INT NOT NULL,
  preference_id INT NOT NULL,
  generated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_results INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (preference_id) REFERENCES room_preferences(id)
);

CREATE TABLE IF NOT EXISTS recommendation_results (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  listing_id INT NOT NULL,
  match_score FLOAT NOT NULL,
  rank_position INT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES recommendation_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id)
);

CREATE TABLE IF NOT EXISTS lifestyle_profiles (
  id                  INT PRIMARY KEY AUTO_INCREMENT,
  user_id             INT NOT NULL UNIQUE,
  sleep_schedule      VARCHAR(20) DEFAULT NULL,
  study_habit         VARCHAR(20) DEFAULT NULL,
  cleanliness_level   VARCHAR(20) DEFAULT NULL,
  social_preference   VARCHAR(20) DEFAULT NULL,
  noise_tolerance     VARCHAR(20) DEFAULT NULL,
  gender_preference   VARCHAR(20) DEFAULT NULL,
  has_pets            BOOLEAN NOT NULL DEFAULT FALSE,
  is_smoker           BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS match_sessions (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  user_id       INT NOT NULL,
  profile_id    INT NOT NULL,
  generated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_matches INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (profile_id) REFERENCES lifestyle_profiles(id)
);

CREATE TABLE IF NOT EXISTS match_results (
  id                  INT PRIMARY KEY AUTO_INCREMENT,
  session_id          INT NOT NULL,
  matched_user_id     INT NOT NULL,
  compatibility_score FLOAT NOT NULL,
  rank_position       INT NOT NULL,
  status              VARCHAR(20) NOT NULL DEFAULT 'pending',
  FOREIGN KEY (session_id) REFERENCES match_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (matched_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS listings (
  id                    INT PRIMARY KEY AUTO_INCREMENT,
  user_id               INT NOT NULL,
  title                 VARCHAR(100) NOT NULL,
  description           TEXT NOT NULL,
  price                 DECIMAL(10,2) NOT NULL,
  room_type             VARCHAR(20) NOT NULL,
  furnishing            VARCHAR(20) DEFAULT NULL,
  bathroom_type         VARCHAR(20) DEFAULT NULL,
  address               VARCHAR(255) NOT NULL,
  latitude              DECIMAL(10,7) DEFAULT NULL,
  longitude             DECIMAL(10,7) DEFAULT NULL,
  distance_from_campus  DECIMAL(4,2) DEFAULT NULL,
  status                VARCHAR(15) NOT NULL DEFAULT 'active',
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listing_photos (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  listing_id  INT NOT NULL,
  photo_url   VARCHAR(255) NOT NULL,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wishlist (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT NOT NULL,
  listing_id INT NOT NULL,
  saved_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_wishlist (user_id, listing_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS search_filters (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  user_id         INT NOT NULL,
  keyword         VARCHAR(100) DEFAULT NULL,
  min_price       DECIMAL(10,2) DEFAULT NULL,
  max_price       DECIMAL(10,2) DEFAULT NULL,
  room_type       VARCHAR(20) DEFAULT NULL,
  max_distance_km DECIMAL(4,2) DEFAULT NULL,
  furnishing      VARCHAR(20) DEFAULT NULL,
  bathroom_type   VARCHAR(20) DEFAULT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
