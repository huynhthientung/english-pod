import re
import sys
import os

def clean_html(text):
    # Remove img tags
    text = re.sub(r'<img[^>]*>', '', text)
    # Remove font tags
    text = re.sub(r'</?font[^>]*>', '', text)
    # Remove script and style blocks content
    text = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', text, flags=re.DOTALL | re.IGNORECASE)
    # Remove specific structural tags but keep content if any (though usually we want to strip head content)
    text = re.sub(r'<!DOCTYPE[^>]*>', '', text, flags=re.IGNORECASE)
    text = re.sub(r'</?(html|head|body)[^>]*>', '', text, flags=re.IGNORECASE)
    # Remove meta and title tags
    text = re.sub(r'<meta[^>]*>', '', text, flags=re.IGNORECASE)
    text = re.sub(r'<title>.*?</title>', '', text, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove spans with style
    text = re.sub(r'<span[^>]*style=["\'][^"\']*["\'][^>]*>(.*?)</span>', r'\1', text, flags=re.I)
    
    return text.strip()

def parse_dialogue_table(table_html):
    rows = re.findall(r'<tr>(.*?)</tr>', table_html, re.DOTALL)
    lines = []
    for row in rows:
        # Extract td contents
        cols = re.findall(r'<td.*?>(.*?)</td>', row, re.DOTALL)
        if len(cols) >= 2:
            s_col = cols[0]
            t_col = cols[1]
            
            # Clean speaker
            speaker = s_col.replace('&nbsp;', ' ').strip()
            speaker = re.sub(r'[:\.]+$', '', speaker) 
            speaker = re.sub(r'<[^>]+>', '', speaker) # Remove tags from speaker
            
            text = t_col.strip()
            text = clean_html(text)
            
            # Skip empty lines
            if not speaker and not text:
                continue
            
            # If speaker matches "A" or "B" or simple names, keep it.
            # Sometimes empty speaker means continuation?
            
            lines.append((speaker, text))
            
    if not lines:
        return ""
        
    html = '<div class="dialogue-block">\n'
    for sp, tx in lines:
        html += f'    <div class="line">\n        <div class="speaker">{sp}</div>\n        <div class="text">{tx}</div>\n    </div>\n'
    html += '</div>'
    return html

def parse_vocab_table(table_html):
    rows = re.findall(r'<tr>(.*?)</tr>', table_html, re.DOTALL)
    items = []
    for row in rows:
        cols = re.findall(r'<td.*?>(.*?)</td>', row, re.DOTALL)
        # Attempt to handle different column counts
        if len(cols) >= 3:
            word = clean_html(cols[0].strip())
            kind = clean_html(cols[1].strip())
            defn = clean_html(cols[2].strip())
            if word or defn:
                items.append((word, kind, defn))
        elif len(cols) == 2:
            word = clean_html(cols[0].strip())
            defn = clean_html(cols[1].strip())
            items.append((word, "", defn))
            
    if not items:
        return ""
        
    html = '<div class="vocab-block">\n'
    for w, k, d in items:
        html += f'    <div class="vocab-item">\n        <div class="word">{w}</div>\n        <div class="type">{k}</div>\n        <div class="definition">{d}</div>\n    </div>\n'
    html += '</div>'
    return html

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    # Extract Title and ID
    title = "Lesson"
    ep_id = ""
    title_match = re.search(r'<h1>\s*<a href="[^"]*">(.*?)</a>.*?\((\d+)\).*?</h1>', content, re.DOTALL)
    if title_match:
        title = title_match.group(1).strip()
        ep_id = title_match.group(2).strip()
    else:
        t_match = re.search(r'<h1>(.*?)</h1>', content, re.DOTALL)
        if t_match:
            title = re.sub(r'<[^>]+>', '', t_match.group(1)).strip()

    clean_parts = []
    
    # Split content by H1 or Table logic from before
    parts = re.split(r'(<h1>.*?</h1>)', content, flags=re.DOTALL)
    
    current_h1 = None
    
    for part in parts:
        part = part.strip()
        if not part: continue
        
        if part.replace('\n', ' ').strip().startswith('<h1'):
            if 'lesson-redirect' in part or 'href=' in part:
                 current_h1 = "Dialogue"
            else:
                header_text = re.sub(r'<[^>]+>', '', part).strip()
                clean_parts.append(f'<h2>{header_text}</h2>')
                current_h1 = header_text
        else:
            table_match = re.search(r'<table>(.*?)</table>', part, re.DOTALL)
            if table_match:
                table_content = table_match.group(1)
                if current_h1 == "Dialogue":
                    clean_parts.append(parse_dialogue_table(table_content))
                else:
                    clean_parts.append(parse_vocab_table(table_content))
            else:
                # If there's non-table content (intro text?), keep it but clean it
                clean_text = clean_html(part)
                # Wrap it if it's not empty and not just tags
                if re.sub(r'<[^>]+>', '', clean_text).strip():
                    clean_parts.append(f'<div class="misc-content">{clean_text}</div>')

    # We return a full HTML structure but WITHOUT embedded styles.
    # The React app will strip the head/body but keep the content.
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
</head>
<body>
    <h1>{title}</h1>
    {chr(10).join(clean_parts)}
</body>
</html>"""
    return html

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 clean_transcript.py <file>")
        sys.exit(1)
        
    infile = sys.argv[1]
    new_html = process_file(infile)
    print(new_html)
