-- チケット本人確認アプリ
-- Kotaro TAKEDA


CREATE TABLE `users` (
  `US_mynumber` varchar(255) NOT NULL COMMENT 'マイナンバー' PRIMARY KEY,
  `US_name` varchar(255) NOT NULL COMMENT 'ニックネーム',
  `US_password` varchar(255) NOT NULL COMMENT 'パスワード',
  `US_mail` varchar(255) NOT NULL COMMENT 'メールアドレス',
  `US_state` int(11) NOT NULL COMMENT '状態(0:通常,1:BAN,2:退会)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT 'ユーザー';

CREATE TABLE `events` (
  `E_id` int(11) NOT NULL COMMENT 'イベントID' AUTO_INCREMENT PRIMARY KEY,
  `E_name` varchar(255) NOT NULL COMMENT 'イベント名',
  `E_datetime` datetime NOT NULL COMMENT 'イベント日時',
  `E_ticket_sum` int(11) NOT NULL COMMENT 'チケット枚数(総数)',
  `E_description` varchar(255) COMMENT '説明文',
  `E_public_flag` int(11) NOT NULL COMMENT '公開フラグ(0:未,1:済)',
  `E_delete_flag` int(11) NOT NULL COMMENT '削除フラグ(0:未,1:済)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT 'イベント';

CREATE TABLE `tickets` (
  `T_event_id` int(11) NOT NULL COMMENT 'イベントID',
  `T_seat_id` int(11) NOT NULL COMMENT '通し番号',
  `T_mynumber` varchar(255) NOT NULL COMMENT 'マイナンバー',
  `T_used_flag` int(11) NOT NULL COMMENT '使用フラグ(0:未,1:済)',
  PRIMARY KEY(T_event_id, T_seat_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT 'チケット';

CREATE TABLE `remains` (
  `R_event_id` int(11) NOT NULL COMMENT 'イベントID' PRIMARY KEY,
  `R_remain_num` int(11) NOT NULL COMMENT 'チケット残り枚数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT '残り枚数';


--
-- テーブルの外部キー制約
--

ALTER TABLE `tickets`
  ADD CONSTRAINT `users_tickets` FOREIGN KEY (`T_mynumber`) REFERENCES `users` (`US_mynumber`),
  ADD CONSTRAINT `events_tickets` FOREIGN KEY (`T_event_id`) REFERENCES `events` (`E_id`);

ALTER TABLE `remains`
  ADD CONSTRAINT `events_remains` FOREIGN KEY (`R_event_id`) REFERENCES `events` (`E_id`);


--
-- VIEW
--

-- 購入者側で確認できるイベント情報
CREATE VIEW `view_show_events` AS
SELECT
  e.E_id AS E_id,
  e.E_name AS E_name,
  DATE_FORMAT(e.E_datetime,'%Y年%m月%d日 %H時%i分') AS E_datetime,
  r.R_remain_num AS R_num,
  e.E_description AS E_description
FROM events e
  LEFT JOIN remains r
  ON r.R_event_id = e.E_id
WHERE e.E_delete_flag = 0
  AND e.E_public_flag = 1
  AND e.E_datetime > now()
ORDER BY e.E_datetime ASC
  ;

-- 購入者側で確認できるチケット情報
CREATE VIEW `view_show_tickets` AS
SELECT
  e.E_id AS E_id,
  e.E_name AS E_name,
  DATE_FORMAT(e.E_datetime,'%Y年%m月%d日 %H時%i分') AS E_datetime,
  e.E_description AS E_description,
  t.T_seat_id AS T_seat_id,
  t.T_mynumber AS T_mynumber,
  t.T_used_flag AS T_used_flag
FROM tickets t
  LEFT JOIN events e
  ON e.E_id = t.T_event_id
WHERE e.E_delete_flag = 0
  AND e.E_public_flag = 1
ORDER BY e.E_datetime ASC
  ;
