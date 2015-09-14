SELECT DISTINCT Comments.id, Comments.UserId, Comments.text, Comments.UrlId, Comments.RepliesToId, Urls.url, Urls.host,
    (SELECT COUNT(1) AS other FROM Hearts AS h
    	WHERE Comments.id = h.CommentId GROUP BY UrlId) AS HeartCount,
    (SELECT COUNT(1) AS other FROM Comments AS c
    	WHERE Comments.id = c.RepliesToId GROUP BY UrlId) AS ReplyCount,
    (SELECT COUNT(1) AS other FROM Flags AS f
    	WHERE Comments.id = f.CommentId GROUP BY UrlId) AS FlagCount,
    (SELECT COUNT(1) AS other FROM Hearts AS h
    	WHERE Comments.id = h.CommentId 
    	AND h.UserId = 2 /* insert username variable here */) AS HeartedByUser,
    (SELECT COUNT(1) AS other FROM Flags AS f
    	WHERE Comments.id = f.CommentId 
    	AND f.UserId = 2 /* insert username variable here */) AS FlaggedByUser,
    (SELECT COUNT(1) AS other FROM Comments AS c
    	WHERE Comments.id = c.RepliesToId  /* insert username variable here */) AS RepliesToUser,
    (CASE WHEN Comments.UserId = 2 THEN 'true' ELSE NULL END) AS isUser
FROM Comments, Users
INNER JOIN Urls
WHERE Comments.RepliesToId = 159 
   AND Urls.url = 'localhost:3000/' /* insert url variable here */
	AND Users.name = 'Eliot Winder' /* insert username variable here */ 
	AND Users.id = '2'	/* insert userid variable here */
	AND Comments.id < 197
ORDER BY Comments.id DESC
LIMIT 25; /* change order here */