--UP-------------------------------------------------------------------------
CREATE TABLE "User" (
  id SERIAL NOT NULL,
  email VARCHAR,
  passwd VARCHAR,
  auth_type VARCHAR,
  auth_provider VARCHAR,
  external_provider_id VARCHAR,
  display_name VARCHAR,
  avatar VARCHAR,
  account_verification_token VARCHAR,
  is_active BOOL NOT NULL,
  account_type VARCHAR,
  PRIMARY KEY(id),
  created_at timestamp,
  updated_at timestamp
);
CREATE TABLE "Conversation" (
  id SERIAL NOT NULL,
  PRIMARY KEY(id),
  created_at timestamp,
  updated_at timestamp
);
CREATE TABLE "Profile" (
  id SERIAL NOT NULL,
  owner_id INTEGER NOT NULL,
  descr VARCHAR,
  city VARCHAR,
  popularity INTEGER,
  total_rating INTEGER,
  account_completion_rate INTEGER,
  PRIMARY KEY(id),
  FOREIGN KEY(owner_id) REFERENCES "User"(id),
  created_at timestamp,
  updated_at timestamp
);
CREATE TABLE "PriceListElement" (
  id SERIAL NOT NULL,
  profile_id INTEGER NOT NULL,
  element_name VARCHAR,
  price FLOAT,
  PRIMARY KEY(id),
  FOREIGN KEY(profile_id) REFERENCES "Profile"(id),
  created_at timestamp,
  updated_at timestamp
);
CREATE TABLE "Image" (
  id SERIAL NOT NULL,
  profile_id INTEGER NOT NULL,
  src_path VARCHAR,
  PRIMARY KEY(id),
  FOREIGN KEY(profile_id) REFERENCES "Profile"(id),
  created_at timestamp,
  updated_at timestamp
);
CREATE TABLE "Message" (
  id SERIAL NOT NULL,
  conversation_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  message_type VARCHAR,
  initial_file_name VARCHAR,
  text VARCHAR,
  src_path VARCHAR,
  PRIMARY KEY(id, conversation_id, sender_id),
  FOREIGN KEY(conversation_id) REFERENCES "Conversation"(id),
  FOREIGN KEY(sender_id) REFERENCES "User"(id),
  created_at timestamp,
  updated_at timestamp
);
CREATE TABLE "UserConversation" (
  id SERIAL NOT NULL,
  user_id INTEGER NOT NULL,
  conversation_id INTEGER NOT NULL,
  PRIMARY KEY(id, user_id, conversation_id),
  FOREIGN KEY(user_id) REFERENCES "User"(id),
  FOREIGN KEY(conversation_id) REFERENCES "Conversation"(id),
  created_at timestamp,
  updated_at timestamp
);
CREATE TABLE "Rating" (
  id SERIAL NOT NULL,
  profile_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL,
  content VARCHAR,
  rating_value FLOAT,
  PRIMARY KEY(id),
  FOREIGN KEY(author_id) REFERENCES "User"(id),
  FOREIGN KEY(profile_id) REFERENCES "Profile"(id),
  created_at timestamp,
  updated_at timestamp
);
CREATE TABLE "DailyReport" (
  id SERIAL NOT NULL,
  profile_id INTEGER NOT NULL,
  summary INTEGER,
  created_at timestamp,
  updated_at timestamp
);
--DOWN ------------------------------------------------------------
drop table "Rating";
drop table "UserConversation";
drop table "Message";
drop table "Image";
drop table "PriceListElement";
drop table "Profile";
drop table "Conversation";
drop table "User";
drop table "DailyReport";