def test_all_staff(app_client):
    response = app_client.get("/api/staff")
    assert response.status_code == 200
    assert len(response.json()) == 355

def test_staff_with_staff_id(app_client):
    response = app_client.get("/api/staff?staff_id=140944")
    assert response.status_code == 200
    assert response.json() == [
        {'staff_id': 140944, 'staff_fname': 'Yee', 'staff_lname': 'Lim', 'dept': 'Sales', 'country': 'Singapore', 'email': 'yee.lim@allinone.com.sg', 'control_access': 3, 
         'curr_role': {
             'role_id': None, 'role_name': 'No role assigned', 'role_department': 'Not in any department', 'role_location': None
         }
    }]

def test_staff_with_email(app_client):
    response = app_client.get("/api/staff?email=yee.lim@allinone.com.sg")
    assert response.status_code == 200
    assert response.json() == [{'staff_id': 140944, 'staff_fname': 'Yee', 'staff_lname': 'Lim', 'email': 'yee.lim@allinone.com.sg', 'dept': 'Sales', 'country': 'Singapore', 'control_access': 3}]

def test_staff_search(app_client):
    response = app_client.get("/api/staff?name=Derek Tan&staff_id=140944&listing_id=1")
    assert response.status_code == 200
    assert response.json() == [
        {'staff_fname': 'Derek', 'staff_lname': 'Tan', 'dept': 'Sales', 'country': 'Singapore', 'control_access': 3, 'staff_id': 140001, 'link': '/applicantdetail?staff_id=140001'}, 
        {'staff_fname': 'Derek', 'staff_lname': 'Toh', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150423, 'link': '/applicantdetail?staff_id=150423'}, 
        {'staff_fname': 'Derek', 'staff_lname': 'Wong', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150155, 'link': '/applicantdetail?staff_id=150155'}, 
        {'staff_fname': 'Aiden', 'staff_lname': 'Tan', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150175, 'link': '/applicantdetail?staff_id=150175'}, 
        {'staff_fname': 'Henry', 'staff_lname': 'Tan', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150845, 'link': '/applicantdetail?staff_id=150845'}
    ]

def test_staff_search_oneself(app_client):
    response = app_client.get("/api/staff?name=Derek Tan&staff_id=140001&listing_id=1")
    assert response.status_code == 200
    # Derek Tan should not be in the list
    assert response.json() == [
        {'staff_fname': 'Derek', 'staff_lname': 'Toh', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150423, 'link': '/applicantdetail?staff_id=150423'}, 
        {'staff_fname': 'Derek', 'staff_lname': 'Wong', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150155, 'link': '/applicantdetail?staff_id=150155'}, 
        {'staff_fname': 'Henry', 'staff_lname': 'Tan', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150845, 'link': '/applicantdetail?staff_id=150845'}, 
        {'staff_fname': 'Aiden', 'staff_lname': 'Tan', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150175, 'link': '/applicantdetail?staff_id=150175'}, 
        {'staff_fname': 'Daniel', 'staff_lname': 'Tan', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150446, 'link': '/applicantdetail?staff_id=150446'}
    ]

def test_staff_headhunt(app_client):
    response = app_client.get('/api/staff?is_manager=True&staff_id=140944&listing_id=1')
    assert response.status_code == 200
    assert len(response.json()['data']) == 336
    assert response.json()['data'][0]['match_percentage'] == 28.57142857142857
    assert response.json()['unique_dept'] == ['Sales', 'Solutioning', 'Engineering', 'HR', 'Finance', 'Consultancy', 'IT']
    assert response.json()['unique_country'] == ['Singapore', 'Malaysia', 'Indonesia', 'Vietnam', 'Hong Kong']