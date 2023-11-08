def test_default_search_role_listing(app_client):
    response = app_client.get(
        "/api/staff_role?staff_id=140736&page=1&limit=10&sort_field=creation_date&order=asc&filters=%7B%7D")
    assert response.status_code == 200
    assert len(response.json()["data"]) == 7
    assert response.json()["pagination"]["current_page"] == 1
    assert response.json()["pagination"]["total_pages"] == 1
    assert response.json()["pagination"]["limit"] == 10
    assert response.json()["pagination"]["total_records"] == 7
    assert len(response.json()["all_regions"]) == 3
    assert len(response.json()["all_roles"]) == 6
    assert len(response.json()["all_skills"]) == 29
    assert len(response.json()["all_departments"]) == 4


def test_search_role_listing_with_sort_field_and_sort_order(app_client):
    response = app_client.get(
        "/api/staff_role?staff_id=140736&page=1&limit=10&sort_field=application_close_date&order=asc&filters=%7B%7D")
    assert response.status_code == 200
    assert len(response.json()["data"]) == 7
    assert response.json()["pagination"]["current_page"] == 1
    assert response.json()["pagination"]["total_pages"] == 1
    assert response.json()["pagination"]["limit"] == 10
    assert response.json()["pagination"]["total_records"] == 7
    assert len(response.json()["all_regions"]) == 3
    assert len(response.json()["all_roles"]) == 6
    assert len(response.json()["all_skills"]) == 29
    assert len(response.json()["all_departments"]) == 4


def test_search_role_listing_with_one_filter(app_client):
    response = app_client.get(
        "/api/staff_role?staff_id=140736&page=1&limit=10&sort_field=creation_date&order=asc&filters=%7B%22Region%22%3A%20%5B%22Indonesia%22%5D%7D")
    assert response.status_code == 200
    assert len(response.json()["data"]) == 2
    assert response.json()["pagination"]["current_page"] == 1
    assert response.json()["pagination"]["total_pages"] == 1
    assert response.json()["pagination"]["limit"] == 10
    assert response.json()["pagination"]["total_records"] == 2
    assert len(response.json()["all_regions"]) == 3
    assert len(response.json()["all_roles"]) == 6
    assert len(response.json()["all_skills"]) == 29
    assert len(response.json()["all_departments"]) == 4


def test_search_role_listing_with_multiple_filters(app_client):
    response = app_client.get(
        "/api/staff_role?staff_id=140736&page=1&limit=10&order=asc&filters=%7B%22Region%22%3A%20%5B%22Indonesia%22%5D%2C%20%22Skill%22%3A%20%5B%22Communication%22%5D%7D")
    assert response.status_code == 200
    assert len(response.json()["data"]) == 2
    assert response.json()["pagination"]["current_page"] == 1
    assert response.json()["pagination"]["total_pages"] == 1
    assert response.json()["pagination"]["limit"] == 10
    assert response.json()["pagination"]["total_records"] == 2
    assert len(response.json()["all_regions"]) == 3
    assert len(response.json()["all_roles"]) == 6
    assert len(response.json()["all_skills"]) == 29
    assert len(response.json()["all_departments"]) == 4

def test_search_role_listing_with_multiple_filters_sort_field_sort_order(app_client):
    response = app_client.get(
        "/api/staff_role?staff_id=140736&page=1&limit=10&sort_field=role_department&order=asc&filters=%7B%22Region%22%3A%20%5B%22Indonesia%22%5D%2C%20%22Skill%22%3A%20%5B%22Communication%22%5D%7D")
    assert response.status_code == 200
    assert len(response.json()["data"]) == 2
    assert response.json()["pagination"]["current_page"] == 1
    assert response.json()["pagination"]["total_pages"] == 1
    assert response.json()["pagination"]["limit"] == 10
    assert response.json()["pagination"]["total_records"] == 2
    assert len(response.json()["all_regions"]) == 3
    assert len(response.json()["all_roles"]) == 6
    assert len(response.json()["all_skills"]) == 29
    assert len(response.json()["all_departments"]) == 4
