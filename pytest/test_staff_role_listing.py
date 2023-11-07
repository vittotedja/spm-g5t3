def test_default_search_role_listing(app_client):
    response = app_client.get(
        "/api/staff_role?staff_id=140736&page=1&limit=10&sort_field=creation_date&order=asc&filters=%7B%7D")
    expected_response = {
        "data": [
            {
                "listing_id": 2,
                "role_id": 19,
                "creation_date": "2023-10-17T12:38:30+00:00",
                "updated_at": "2023-10-26T06:26:58+00:00",
                "deleted_at": "",
                "application_close_date": "2023-11-10T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Indonesia",
                "vacancy": 6,
                "role_name": "Sales Manager",
                "role_desc": "The Sales Manager is responsible for managing the organisation's sales growth. By analysing client segmentation and competitor landscape, he/she develops sales strategies. He supports lead generation, and conducts business and contract negotiations to increase client acquisition and boost retention. \r\n\r\nInnovative and resourceful, he demonstrates initiative in identifying new opportunities both locally and regionally and converting them into actual sales. He builds good rapport with new and existing clients by pro-actively anticipating clients' needs and identifying business solutions to meet those needs. He networks extensively outside of the office to stay in close contact with the key industry stakeholders.",
                "role_department": "Sales",
                "role_skill": [
                    23,
                    21,
                    24,
                    60,
                    53,
                    72,
                    79,
                    73,
                    15,
                    16,
                    20,
                    10
                ],
                "percentage_match": 8.333333333333332
            },
            {
                "listing_id": 4,
                "role_id": 3,
                "creation_date": "2023-10-17T16:27:10+00:00",
                "updated_at": "2023-10-28T16:17:41+00:00",
                "deleted_at": "",
                "application_close_date": "2023-12-24T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Vietnam",
                "vacancy": 2,
                "role_name": "Call Centre",
                "role_desc": "Call Centre Executive is responsible for providing assistance to customers by addressing their queries and requests. He/She advises customers on appropriate products and services based on their needs. He is responsible for the preparation of customer documentation. In the case of complex customer requests, he escalates them to senior officers. He is able to abide by safety and/or security standards in the workplace.\r\n\r\nThe Call Centre Executive  pays strong attention to details to verify and process documentation. He also shows initiative and quick decision-making skills to provide excellent personalised customer services and support. He is comfortable with various stakeholder interactions whilst working in shifts and possesses adequate computer literacy to process customer documentation.",
                "role_department": "Engineering Operation",
                "role_skill": [
                    21,
                    78,
                    28,
                    24,
                    53,
                    72,
                    19,
                    20
                ],
                "percentage_match": 0
            },
            {
                "listing_id": 14,
                "role_id": 13,
                "creation_date": "2023-10-23T10:20:17+00:00",
                "updated_at": "2023-10-30T12:20:48+00:00",
                "deleted_at": "",
                "application_close_date": "2023-12-21T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Singapore",
                "vacancy": 3,
                "role_name": "IT Analyst",
                "role_desc": "IT Analyst performs routine infrastructure operations and maintenance activities. He/She assists with monitoring infrastructure performance. He checks for problems in existing systems and modifies work processes by following defined procedures, processes and quality standards. He is required to be on standby with on-call availability with varied shifts including nights, weekends and holidays. He works in a team setting and is proficient in infrastructure systems and network-related tools and techniques required by the organisation. He is also familiar with the relevant software platforms on which the database is deployed. The Associate Infrastructure Support Engineer is able to solve issues quickly and effectively as they arise. He is able to methodically identify the cause of the issue, evaluate it and develop a solution in collaboration with the team. He is able to communicate effectively and displays high service level standards.",
                "role_department": "System Solutioning",
                "role_skill": [
                    21,
                    53,
                    64,
                    72,
                    14,
                    20,
                    43,
                    44,
                    47,
                    56
                ],
                "percentage_match": 0
            },
            {
                "listing_id": 30,
                "role_id": 15,
                "creation_date": "2023-10-25T02:11:10+00:00",
                "updated_at": "2023-10-29T01:47:13+00:00",
                "deleted_at": "",
                "application_close_date": "2023-11-29T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Indonesia",
                "vacancy": 1,
                "role_name": "Junior Engineer",
                "role_desc": "The Junior Engineerapplies engineering principles and techniques to optimise the equipment and systems within the manufacturing facility. He/She provides technical guidance and direction for the installation of equipment and systems. He develops plans for the maintenance of equipment and systems, and recommends engineering solutions to troubleshoot faults. The Junior Engineerinnovates equipment and systems, and contributes to manufacturing equipment and systems improvement projects by conducting feasibility assessments and tests on new technologies. He is also expected to manage energy resources and utilities by developing solutions to optimise machine availability and energy efficiency. The Junior Engineermust ensure compliance with Standard Operating Procedures (SOPs), Health, Safety and Environment (HSE) regulations and Current Good Manufacturing Practices (CGMPs) within his purview. He develops guidelines and conducts equipment qualification and validation in line with biopharmaceuticals manufacturing regulatory requirements. \r\n\r\nThe Junior Engineershould possess an enquiring and analytical mind and have a knack for investigating issues, analysing multifaceted engineering problems and developing solutions. He must also be a strong team player who can guide and mentor others, and communicate technical advices and solutions to colleagues beyond the team.",
                "role_department": "Engineering Operations",
                "role_skill": [
                    21,
                    53,
                    20,
                    63
                ],
                "percentage_match": 0
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 1,
            "limit": 10,
            "total_records": 4
        },
        "all_regions": [
            "Indonesia",
            "Singapore",
            "Vietnam"
        ],
        "all_roles": [
            "Call Centre",
            "IT Analyst",
            "Junior Engineer",
            "Sales Manager"
        ],
        "all_skills": [
            "Budgeting",
            "Business Needs Analysis",
            "Business Negotiation",
            "Business Presentation Delivery",
            "Call Centre Management",
            "Collaboration",
            "Communication",
            "Customer Acquisition Management",
            "Customer Relationship Management",
            "Digital Fluency",
            "Infrastructure Deployment",
            "Infrastructure Support",
            "Network Administration and Maintenance",
            "Problem Solving",
            "Project Management",
            "Sales Closure",
            "Sense Making",
            "Service Level Management",
            "Stakeholder Management",
            "Strategy Planning",
            "Technology Application",
            "Technology Integration"
        ],
        "all_departments": [
            "Engineering Operation",
            "Engineering Operations",
            "Sales",
            "System Solutioning"
        ]
    }
    assert response.status_code == 200
    assert response.json() == expected_response


def test_search_role_listing_with_sort_field_and_sort_order(app_client):
    response = app_client.get(
        "/api/staff_role?staff_id=140736&page=1&limit=10&sort_field=application_close_date&order=asc&filters=%7B%7D")
    expected_response = {
        "data": [
            {
                "listing_id": 2,
                "role_id": 19,
                "creation_date": "2023-10-17T12:38:30+00:00",
                "updated_at": "2023-10-26T06:26:58+00:00",
                "deleted_at": "",
                "application_close_date": "2023-11-10T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Indonesia",
                "vacancy": 6,
                "role_name": "Sales Manager",
                "role_desc": "The Sales Manager is responsible for managing the organisation's sales growth. By analysing client segmentation and competitor landscape, he/she develops sales strategies. He supports lead generation, and conducts business and contract negotiations to increase client acquisition and boost retention. \r\n\r\nInnovative and resourceful, he demonstrates initiative in identifying new opportunities both locally and regionally and converting them into actual sales. He builds good rapport with new and existing clients by pro-actively anticipating clients' needs and identifying business solutions to meet those needs. He networks extensively outside of the office to stay in close contact with the key industry stakeholders.",
                "role_department": "Sales",
                "role_skill": [
                    23,
                    21,
                    24,
                    60,
                    53,
                    72,
                    79,
                    73,
                    15,
                    16,
                    20,
                    10
                ],
                "percentage_match": 8.333333333333332
            },
            {
                "listing_id": 30,
                "role_id": 15,
                "creation_date": "2023-10-25T02:11:10+00:00",
                "updated_at": "2023-10-29T01:47:13+00:00",
                "deleted_at": "",
                "application_close_date": "2023-11-29T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Indonesia",
                "vacancy": 1,
                "role_name": "Junior Engineer",
                "role_desc": "The Junior Engineerapplies engineering principles and techniques to optimise the equipment and systems within the manufacturing facility. He/She provides technical guidance and direction for the installation of equipment and systems. He develops plans for the maintenance of equipment and systems, and recommends engineering solutions to troubleshoot faults. The Junior Engineerinnovates equipment and systems, and contributes to manufacturing equipment and systems improvement projects by conducting feasibility assessments and tests on new technologies. He is also expected to manage energy resources and utilities by developing solutions to optimise machine availability and energy efficiency. The Junior Engineermust ensure compliance with Standard Operating Procedures (SOPs), Health, Safety and Environment (HSE) regulations and Current Good Manufacturing Practices (CGMPs) within his purview. He develops guidelines and conducts equipment qualification and validation in line with biopharmaceuticals manufacturing regulatory requirements. \r\n\r\nThe Junior Engineershould possess an enquiring and analytical mind and have a knack for investigating issues, analysing multifaceted engineering problems and developing solutions. He must also be a strong team player who can guide and mentor others, and communicate technical advices and solutions to colleagues beyond the team.",
                "role_department": "Engineering Operations",
                "role_skill": [
                    21,
                    53,
                    20,
                    63
                ],
                "percentage_match": 0
            },
            {
                "listing_id": 14,
                "role_id": 13,
                "creation_date": "2023-10-23T10:20:17+00:00",
                "updated_at": "2023-10-30T12:20:48+00:00",
                "deleted_at": "",
                "application_close_date": "2023-12-21T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Singapore",
                "vacancy": 3,
                "role_name": "IT Analyst",
                "role_desc": "IT Analyst performs routine infrastructure operations and maintenance activities. He/She assists with monitoring infrastructure performance. He checks for problems in existing systems and modifies work processes by following defined procedures, processes and quality standards. He is required to be on standby with on-call availability with varied shifts including nights, weekends and holidays. He works in a team setting and is proficient in infrastructure systems and network-related tools and techniques required by the organisation. He is also familiar with the relevant software platforms on which the database is deployed. The Associate Infrastructure Support Engineer is able to solve issues quickly and effectively as they arise. He is able to methodically identify the cause of the issue, evaluate it and develop a solution in collaboration with the team. He is able to communicate effectively and displays high service level standards.",
                "role_department": "System Solutioning",
                "role_skill": [
                    21,
                    53,
                    64,
                    72,
                    14,
                    20,
                    43,
                    44,
                    47,
                    56
                ],
                "percentage_match": 0
            },
            {
                "listing_id": 4,
                "role_id": 3,
                "creation_date": "2023-10-17T16:27:10+00:00",
                "updated_at": "2023-10-28T16:17:41+00:00",
                "deleted_at": "",
                "application_close_date": "2023-12-24T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Vietnam",
                "vacancy": 2,
                "role_name": "Call Centre",
                "role_desc": "Call Centre Executive is responsible for providing assistance to customers by addressing their queries and requests. He/She advises customers on appropriate products and services based on their needs. He is responsible for the preparation of customer documentation. In the case of complex customer requests, he escalates them to senior officers. He is able to abide by safety and/or security standards in the workplace.\r\n\r\nThe Call Centre Executive  pays strong attention to details to verify and process documentation. He also shows initiative and quick decision-making skills to provide excellent personalised customer services and support. He is comfortable with various stakeholder interactions whilst working in shifts and possesses adequate computer literacy to process customer documentation.",
                "role_department": "Engineering Operation",
                "role_skill": [
                    21,
                    78,
                    28,
                    24,
                    53,
                    72,
                    19,
                    20
                ],
                "percentage_match": 0
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 1,
            "limit": 10,
            "total_records": 4
        },
        "all_regions": [
            "Indonesia",
            "Singapore",
            "Vietnam"
        ],
        "all_roles": [
            "Call Centre",
            "IT Analyst",
            "Junior Engineer",
            "Sales Manager"
        ],
        "all_skills": [
            "Budgeting",
            "Business Needs Analysis",
            "Business Negotiation",
            "Business Presentation Delivery",
            "Call Centre Management",
            "Collaboration",
            "Communication",
            "Customer Acquisition Management",
            "Customer Relationship Management",
            "Digital Fluency",
            "Infrastructure Deployment",
            "Infrastructure Support",
            "Network Administration and Maintenance",
            "Problem Solving",
            "Project Management",
            "Sales Closure",
            "Sense Making",
            "Service Level Management",
            "Stakeholder Management",
            "Strategy Planning",
            "Technology Application",
            "Technology Integration"
        ],
        "all_departments": [
            "Engineering Operation",
            "Engineering Operations",
            "Sales",
            "System Solutioning"
        ]
    }
    assert response.status_code == 200
    assert response.json() == expected_response
    assert response.json()["pagination"]["total_records"] == 4


def test_search_role_listing_with_one_filter(app_client):
    response = app_client.get(
        "/api/staff_role?staff_id=140736&page=1&limit=10&sort_field=creation_date&order=asc&filters=%7B%22Region%22%3A%20%5B%22Indonesia%22%5D%7D")
    expected_response = {
        "data": [
            {
                "listing_id": 2,
                "role_id": 19,
                "creation_date": "2023-10-17T12:38:30+00:00",
                "updated_at": "2023-10-26T06:26:58+00:00",
                "deleted_at": "",
                "application_close_date": "2023-11-10T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Indonesia",
                "vacancy": 6,
                "role_name": "Sales Manager",
                "role_desc": "The Sales Manager is responsible for managing the organisation's sales growth. By analysing client segmentation and competitor landscape, he/she develops sales strategies. He supports lead generation, and conducts business and contract negotiations to increase client acquisition and boost retention. \r\n\r\nInnovative and resourceful, he demonstrates initiative in identifying new opportunities both locally and regionally and converting them into actual sales. He builds good rapport with new and existing clients by pro-actively anticipating clients' needs and identifying business solutions to meet those needs. He networks extensively outside of the office to stay in close contact with the key industry stakeholders.",
                "role_department": "Sales",
                "role_skill": [
                    23,
                    21,
                    24,
                    60,
                    53,
                    72,
                    79,
                    73,
                    15,
                    16,
                    20,
                    10
                ],
                "percentage_match": 8.333333333333332
            },
            {
                "listing_id": 30,
                "role_id": 15,
                "creation_date": "2023-10-25T02:11:10+00:00",
                "updated_at": "2023-10-29T01:47:13+00:00",
                "deleted_at": "",
                "application_close_date": "2023-11-29T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Indonesia",
                "vacancy": 1,
                "role_name": "Junior Engineer",
                "role_desc": "The Junior Engineerapplies engineering principles and techniques to optimise the equipment and systems within the manufacturing facility. He/She provides technical guidance and direction for the installation of equipment and systems. He develops plans for the maintenance of equipment and systems, and recommends engineering solutions to troubleshoot faults. The Junior Engineerinnovates equipment and systems, and contributes to manufacturing equipment and systems improvement projects by conducting feasibility assessments and tests on new technologies. He is also expected to manage energy resources and utilities by developing solutions to optimise machine availability and energy efficiency. The Junior Engineermust ensure compliance with Standard Operating Procedures (SOPs), Health, Safety and Environment (HSE) regulations and Current Good Manufacturing Practices (CGMPs) within his purview. He develops guidelines and conducts equipment qualification and validation in line with biopharmaceuticals manufacturing regulatory requirements. \r\n\r\nThe Junior Engineershould possess an enquiring and analytical mind and have a knack for investigating issues, analysing multifaceted engineering problems and developing solutions. He must also be a strong team player who can guide and mentor others, and communicate technical advices and solutions to colleagues beyond the team.",
                "role_department": "Engineering Operations",
                "role_skill": [
                    21,
                    53,
                    20,
                    63
                ],
                "percentage_match": 0
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 1,
            "limit": 10,
            "total_records": 2
        },
        "all_regions": [
            "Indonesia",
            "Singapore",
            "Vietnam"
        ],
        "all_roles": [
            "Call Centre",
            "IT Analyst",
            "Junior Engineer",
            "Sales Manager"
        ],
        "all_skills": [
            "Budgeting",
            "Business Needs Analysis",
            "Business Negotiation",
            "Business Presentation Delivery",
            "Call Centre Management",
            "Collaboration",
            "Communication",
            "Customer Acquisition Management",
            "Customer Relationship Management",
            "Digital Fluency",
            "Infrastructure Deployment",
            "Infrastructure Support",
            "Network Administration and Maintenance",
            "Problem Solving",
            "Project Management",
            "Sales Closure",
            "Sense Making",
            "Service Level Management",
            "Stakeholder Management",
            "Strategy Planning",
            "Technology Application",
            "Technology Integration"
        ],
        "all_departments": [
            "Engineering Operation",
            "Engineering Operations",
            "Sales",
            "System Solutioning"
        ]
    }
    assert response.status_code == 200
    assert response.json() == expected_response
    assert response.json()["pagination"]["total_records"] == 2


def test_search_role_listing_with_multiple_filters(app_client):
    response = app_client.get(
        "/api/staff_role?staff_id=140736&page=1&limit=10&order=asc&filters=%7B%22Region%22%3A%20%5B%22Indonesia%22%5D%2C%20%22Skill%22%3A%20%5B%22Communication%22%5D%7D")
    expected_response = {
        "data": [
            {
                "listing_id": 2,
                "role_id": 19,
                "creation_date": "2023-10-17T12:38:30+00:00",
                "updated_at": "2023-10-26T06:26:58+00:00",
                "deleted_at": "",
                "application_close_date": "2023-11-10T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Indonesia",
                "vacancy": 6,
                "role_name": "Sales Manager",
                "role_desc": "The Sales Manager is responsible for managing the organisation's sales growth. By analysing client segmentation and competitor landscape, he/she develops sales strategies. He supports lead generation, and conducts business and contract negotiations to increase client acquisition and boost retention. \r\n\r\nInnovative and resourceful, he demonstrates initiative in identifying new opportunities both locally and regionally and converting them into actual sales. He builds good rapport with new and existing clients by pro-actively anticipating clients' needs and identifying business solutions to meet those needs. He networks extensively outside of the office to stay in close contact with the key industry stakeholders.",
                "role_department": "Sales",
                "role_skill": [
                    23,
                    21,
                    24,
                    60,
                    53,
                    72,
                    79,
                    73,
                    15,
                    16,
                    20,
                    10
                ],
                "percentage_match": 8.333333333333332
            },
            {
                "listing_id": 30,
                "role_id": 15,
                "creation_date": "2023-10-25T02:11:10+00:00",
                "updated_at": "2023-10-29T01:47:13+00:00",
                "deleted_at": "",
                "application_close_date": "2023-11-29T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Indonesia",
                "vacancy": 1,
                "role_name": "Junior Engineer",
                "role_desc": "The Junior Engineerapplies engineering principles and techniques to optimise the equipment and systems within the manufacturing facility. He/She provides technical guidance and direction for the installation of equipment and systems. He develops plans for the maintenance of equipment and systems, and recommends engineering solutions to troubleshoot faults. The Junior Engineerinnovates equipment and systems, and contributes to manufacturing equipment and systems improvement projects by conducting feasibility assessments and tests on new technologies. He is also expected to manage energy resources and utilities by developing solutions to optimise machine availability and energy efficiency. The Junior Engineermust ensure compliance with Standard Operating Procedures (SOPs), Health, Safety and Environment (HSE) regulations and Current Good Manufacturing Practices (CGMPs) within his purview. He develops guidelines and conducts equipment qualification and validation in line with biopharmaceuticals manufacturing regulatory requirements. \r\n\r\nThe Junior Engineershould possess an enquiring and analytical mind and have a knack for investigating issues, analysing multifaceted engineering problems and developing solutions. He must also be a strong team player who can guide and mentor others, and communicate technical advices and solutions to colleagues beyond the team.",
                "role_department": "Engineering Operations",
                "role_skill": [
                    21,
                    53,
                    20,
                    63
                ],
                "percentage_match": 0
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 1,
            "limit": 10,
            "total_records": 2
        },
        "all_regions": [
            "Indonesia",
            "Singapore",
            "Vietnam"
        ],
        "all_roles": [
            "Call Centre",
            "IT Analyst",
            "Junior Engineer",
            "Sales Manager"
        ],
        "all_skills": [
            "Budgeting",
            "Business Needs Analysis",
            "Business Negotiation",
            "Business Presentation Delivery",
            "Call Centre Management",
            "Collaboration",
            "Communication",
            "Customer Acquisition Management",
            "Customer Relationship Management",
            "Digital Fluency",
            "Infrastructure Deployment",
            "Infrastructure Support",
            "Network Administration and Maintenance",
            "Problem Solving",
            "Project Management",
            "Sales Closure",
            "Sense Making",
            "Service Level Management",
            "Stakeholder Management",
            "Strategy Planning",
            "Technology Application",
            "Technology Integration"
        ],
        "all_departments": [
            "Engineering Operation",
            "Engineering Operations",
            "Sales",
            "System Solutioning"
        ]
    }
    assert response.status_code == 200
    assert response.json() == expected_response
    assert response.json()["pagination"]["total_records"] == 2


def test_search_role_listing_with_multiple_filters_sort_field_sort_order(app_client):
    response = app_client.get(
        "/api/staff_role?staff_id=140736&page=1&limit=10&sort_field=role_department&order=asc&filters=%7B%22Region%22%3A%20%5B%22Indonesia%22%5D%2C%20%22Skill%22%3A%20%5B%22Communication%22%5D%7D")
    expected_response = {
        "data": [
            {
                "listing_id": 30,
                "role_id": 15,
                "creation_date": "2023-10-25T02:11:10+00:00",
                "updated_at": "2023-10-29T01:47:13+00:00",
                "deleted_at": "",
                "application_close_date": "2023-11-29T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Indonesia",
                "vacancy": 1,
                "role_name": "Junior Engineer",
                "role_desc": "The Junior Engineerapplies engineering principles and techniques to optimise the equipment and systems within the manufacturing facility. He/She provides technical guidance and direction for the installation of equipment and systems. He develops plans for the maintenance of equipment and systems, and recommends engineering solutions to troubleshoot faults. The Junior Engineerinnovates equipment and systems, and contributes to manufacturing equipment and systems improvement projects by conducting feasibility assessments and tests on new technologies. He is also expected to manage energy resources and utilities by developing solutions to optimise machine availability and energy efficiency. The Junior Engineermust ensure compliance with Standard Operating Procedures (SOPs), Health, Safety and Environment (HSE) regulations and Current Good Manufacturing Practices (CGMPs) within his purview. He develops guidelines and conducts equipment qualification and validation in line with biopharmaceuticals manufacturing regulatory requirements. \r\n\r\nThe Junior Engineershould possess an enquiring and analytical mind and have a knack for investigating issues, analysing multifaceted engineering problems and developing solutions. He must also be a strong team player who can guide and mentor others, and communicate technical advices and solutions to colleagues beyond the team.",
                "role_department": "Engineering Operations",
                "role_skill": [
                    21,
                    53,
                    20,
                    63
                ],
                "percentage_match": 0
            },
            {
                "listing_id": 2,
                "role_id": 19,
                "creation_date": "2023-10-17T12:38:30+00:00",
                "updated_at": "2023-10-26T06:26:58+00:00",
                "deleted_at": "",
                "application_close_date": "2023-11-10T16:00:00+00:00",
                "updated_from": "",
                "listing_location": "Indonesia",
                "vacancy": 6,
                "role_name": "Sales Manager",
                "role_desc": "The Sales Manager is responsible for managing the organisation's sales growth. By analysing client segmentation and competitor landscape, he/she develops sales strategies. He supports lead generation, and conducts business and contract negotiations to increase client acquisition and boost retention. \r\n\r\nInnovative and resourceful, he demonstrates initiative in identifying new opportunities both locally and regionally and converting them into actual sales. He builds good rapport with new and existing clients by pro-actively anticipating clients' needs and identifying business solutions to meet those needs. He networks extensively outside of the office to stay in close contact with the key industry stakeholders.",
                "role_department": "Sales",
                "role_skill": [
                    23,
                    21,
                    24,
                    60,
                    53,
                    72,
                    79,
                    73,
                    15,
                    16,
                    20,
                    10
                ],
                "percentage_match": 8.333333333333332
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 1,
            "limit": 10,
            "total_records": 2
        },
        "all_regions": [
            "Indonesia",
            "Singapore",
            "Vietnam"
        ],
        "all_roles": [
            "Call Centre",
            "IT Analyst",
            "Junior Engineer",
            "Sales Manager"
        ],
        "all_skills": [
            "Budgeting",
            "Business Needs Analysis",
            "Business Negotiation",
            "Business Presentation Delivery",
            "Call Centre Management",
            "Collaboration",
            "Communication",
            "Customer Acquisition Management",
            "Customer Relationship Management",
            "Digital Fluency",
            "Infrastructure Deployment",
            "Infrastructure Support",
            "Network Administration and Maintenance",
            "Problem Solving",
            "Project Management",
            "Sales Closure",
            "Sense Making",
            "Service Level Management",
            "Stakeholder Management",
            "Strategy Planning",
            "Technology Application",
            "Technology Integration"
        ],
        "all_departments": [
            "Engineering Operation",
            "Engineering Operations",
            "Sales",
            "System Solutioning"
        ]
    }
    assert response.status_code == 200
    assert response.json() == expected_response
    assert response.json()["pagination"]["total_records"] == 2
