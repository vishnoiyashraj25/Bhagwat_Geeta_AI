INSERT INTO tags (tag_name, description) VALUES
('job_loss', 'Losing job or financial stress'),
('family_trust_issue', 'Family not believing in user'),
('loneliness', 'Feeling alone or isolated');

INSERT INTO mantras (tag_id, priority_number, sanskrit_text, meaning, application_context, chapter_verse, language)
VALUES
((SELECT id FROM tags WHERE tag_name='job_loss'), 1, 'कर्मण्येवाधिकारस्ते', 'You have a right to perform your duty, not to the fruits.', 'Focus on action not the result', '2.47','en'),
((SELECT id FROM tags WHERE tag_name='family_trust_issue'), 1, 'मा कर्मफलहेतुर्भूः', 'Do not be attached to the fruits of action.', 'Do your duty even if family misunderstands','2.47','en');

INSERT INTO stories (tag_id, priority_number, title, content, moral_lesson)
VALUES
((SELECT id FROM tags WHERE tag_name='job_loss'), 1, 'Arjuna’s Doubt', 'Arjuna was in despair before the war...', 'Duty over results'),
((SELECT id FROM tags WHERE tag_name='family_trust_issue'), 1, 'Prahlada’s Faith', 'Prahlada remained devoted despite opposition...', 'Faith stays');
