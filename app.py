from flask import Flask, render_template, request, jsonify
import sqlite3
import os
from datetime import datetime
import hashlib

app = Flask(__name__)
DB_PATH = 'invitation.db'

# ============== DB 초기화 ==============
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS guestbook (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_name TEXT NOT NULL,
        visitor_id TEXT NOT NULL,
        password TEXT NOT NULL,
        message TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    conn.commit()
    conn.close()

init_db()

# ============== 유틸리티 ==============
def hash_password(password):
    """비밀번호 해싱"""
    return hashlib.sha256(password.encode()).hexdigest()

def get_client_ip():
    """클라이언트 IP 추출"""
    if request.environ.get('HTTP_X_FORWARDED_FOR'):
        return request.environ.get('HTTP_X_FORWARDED_FOR').split(',')[0]
    return request.remote_addr

# ============== 메인 페이지 ==============
@app.route('/')
def index():
    return render_template('index.html')

# ============== 방명록 API ==============
@app.route('/api/guestbook/add', methods=['POST'])
def add_guestbook():
    """방명록 추가"""
    data = request.json
    visitor_name = data.get('visitor_name', '').strip()
    visitor_id = data.get('visitor_id', '').strip()
    password = data.get('password', '').strip()
    message = data.get('message', '').strip()

    # 검증
    if not all([visitor_name, visitor_id, password, message]):
        return jsonify({'error': '모든 필드를 입력해주세요.'}), 400
    
    if len(visitor_id) < 2:
        return jsonify({'error': 'ID는 2자 이상이어야 합니다.'}), 400
    
    if len(password) < 4:
        return jsonify({'error': '비밀번호는 4자 이상이어야 합니다.'}), 400

    ip_address = get_client_ip()
    password_hash = hash_password(password)

    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''INSERT INTO guestbook (visitor_name, visitor_id, password, message, ip_address) 
                     VALUES (?, ?, ?, ?, ?)''',
                  (visitor_name, visitor_id, password_hash, message, ip_address))
        conn.commit()
        conn.close()
        return jsonify({'success': '방명록이 작성되었습니다.'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/guestbook/list', methods=['GET'])
def list_guestbook():
    """방명록 목록 조회 (비로그인)"""
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT visitor_name, created_at FROM guestbook ORDER BY created_at DESC')
        rows = c.fetchall()
        conn.close()
        
        guestbooks = [{'name': row[0], 'date': row[1]} for row in rows]
        return jsonify(guestbooks), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """관리자 로그인"""
    data = request.json
    admin_id = data.get('admin_id', '').strip()
    admin_pw = data.get('admin_pw', '').strip()

    MASTER_ID = 'wndlrdl123'
    MASTER_PW = 'wndlrl123'

    if admin_id == MASTER_ID and admin_pw == MASTER_PW:
        return jsonify({'success': True, 'message': '로그인 성공'}), 200
    else:
        return jsonify({'success': False, 'error': '아이디 또는 비밀번호가 틀렸습니다.'}), 401

@app.route('/api/admin/guestbook', methods=['GET'])
def admin_guestbook():
    """관리자: 모든 방명록 + IP 주소 조회"""
    # 실제 구현 시 세션 토큰 검증 필요
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT id, visitor_name, visitor_id, message, ip_address, created_at FROM guestbook ORDER BY created_at DESC')
        rows = c.fetchall()
        conn.close()
        
        guestbooks = []
        for row in rows:
            guestbooks.append({
                'id': row[0],
                'name': row[1],
                'id_field': row[2],
                'message': row[3],
                'ip': row[4],
                'date': row[5]
            })
        return jsonify(guestbooks), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/guestbook/<int:guestbook_id>', methods=['DELETE'])
def delete_guestbook(guestbook_id):
    """관리자: 방명록 삭제"""
    # 실제 구현 시 세션 토큰 검증 필요
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('DELETE FROM guestbook WHERE id = ?', (guestbook_id,))
        conn.commit()
        conn.close()
        return jsonify({'success': '방명록이 삭제되었습니다.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============== 에러 핸들러 ==============
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': '페이지를 찾을 수 없습니다.'}), 404

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
