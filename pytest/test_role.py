def test_get_all_roles(app_client):
    response = app_client.get("/api/role")
    assert response.status_code == 200
    assert len(response.json()) == 22

def test_get_single_role(app_client):
    response = app_client.get("/api/role?role_id=1")
    assert response.status_code == 200
    assert response.json() == [{
        'role_name': 'Account Manager', 
        'role_desc': "The Account Manager acts as a key point of contact between an organisation and its clients. He/She possesses thorough product knowledge and oversees product and/or service sales. He works with customers to identify their wants and prepares reports by collecting, analysing, and summarising sales information. He contacts existing customers to discuss and give recommendations on how specific products or services can meet their needs. He maintains customer relationships to strategically place new products and drive sales for long-term growth. He works in a fast-paced and dynamic environment, and travels frequently to clients' premises for meetings. He is familiar with client relationship management and sales tools. He is knowledgeable of the organisation's products and services, as well as trends, developments and challenges of the industry domain. The Sales Account Manager is a resourceful, people-focused and persistent individual, who takes rejection as a personal challenge to succeed when given opportunity. He appreciates the value of long lasting relationships and prioritises efforts to build trust with existing and potential customers. He exhibits good listening skills and is able to establish rapport with customers and team members alike easily.", 
        'role_id': 1, 
        'role_department': 'Sales'
    }]

def test_get_single_role_not_found(app_client):
    response = app_client.get("/api/role?role_id=999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Role not found with the provided role_id."
