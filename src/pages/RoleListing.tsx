import React, {useEffect, useState} from 'react';
import RoleCard from '../components/RoleCard';
import {getAsync} from '../utilities/Services';
import FilterBox from '../components/FilterBox';
import SortComponent from '../components/SortComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import confused_guy from '../assets/confused_guy.png';

interface Role {
	role_id: number;
	created_at: string;
	role_name: string;
	role_desc: string;
	dept: string;
	'deleted?': boolean;
	deleted_At: string | null;
	level: string | null;
	location: string | null;
	appl_close_date: Date | null;
	responsibilities: string | null;
	percentage_match: number;
}
interface FilterItem {
	name: string;
	values: string[];
}

const RoleListing: React.FC = () => {
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState(1);
	const [sortField, setSortField] = useState('created_at');
	const [order, setOrder] = useState('asc');
	const [hasMore, setHasMore] = useState(true);
	const [filters, setFilters] = useState<FilterItem[]>([]);
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string[]>
	>({});

	const fetchFirst = async () => {
		setPage(1); // Reset to the first page
		setRoles([]); // Clear existing roles
		setHasMore(true); // Reset hasMore
		setLoading(true); // Set loading to true
		const response = await getAsync(
			`api/get_staff_role?user_id=1&page=1&limit=5&sort_field=${sortField}&order=${order}&filters=${JSON.stringify(
				selectedFilters
			)}`
		);
		const data = await response.json();
		const filters = [
			{name: 'Skills', values: data.all_skills},
			{name: 'Region', values: data.all_regions},
			{name: 'Role Name', values: data.all_roles},
			{name: 'Department', values: data.all_departments},
		];
		setFilters(filters);
		if (data.data.length === 0) {
			setHasMore(false);
		} else {
			setRoles(data.data);
		}
		setLoading(false);
	};

	const fetchMore = async () => {
		if (!hasMore || loading) return;
		setLoading(true);
		var response;
		if (page === 1) {
			response = await getAsync(
				`api/get_staff_role?user_id=1&page=${2}&limit=5&sort_field=${sortField}&order=${order}&filters=${JSON.stringify(
					selectedFilters
				)}`
			);
			setPage(2);
		} else {
			response = await getAsync(
				`api/get_staff_role?user_id=1&page=${page}&limit=5&sort_field=${sortField}&order=${order}&filters=${JSON.stringify(
					selectedFilters
				)}`
			);
		}

		const data = await response.json();
		if (data.pagination.current_page > data.pagination.total_pages) {
			setHasMore(false);
		} else {
			setRoles((prevRoles) => [...prevRoles, ...data.data]);
			setPage((prevPage) => prevPage + 1);
		}
		setLoading(false);
	};

	const handleSortFieldChange = (field: string) => {
		setSortField(field);
	};

	const handleOrderChange = (newOrder: string) => {
		setOrder(newOrder);
	};

	const handleFilterChange = (name: string, values: string[]) => {
		setSelectedFilters((prev) => ({...prev, [name]: values}));
	};

	useEffect(() => {
		fetchFirst();
	}, [sortField, order, selectedFilters]);

	return (
		<div className="flex justify-around">
			<FilterBox filters={filters} onFilterChange={handleFilterChange} />
			<div className="flex-col justify-center w-4/6">
				<h2 className="text-2xl font-bold text-left">Role Listings</h2>
				<SortComponent
					options={[
						{value: 'created_at', name: 'Created At'},
						{value: 'role_name', name: 'Role Name'},
						{value: 'dept', name: 'Department'},
						{
							value: 'appl_close_date',
							name: 'Application Deadline',
						},
					]}
					onSortFieldChange={handleSortFieldChange}
					onOrderChange={handleOrderChange}
				/>
				{roles.length > 0 ? (
					<InfiniteScroll
						dataLength={roles.length}
						next={fetchMore}
						hasMore={hasMore}
						loader={<span></span>}
					>
						{roles.map((role) => (
							<RoleCard
								key={role.role_id}
								role_ID={role.role_id}
								role_name={role.role_name}
								role_dept={role.dept}
								role_percentage_match={role.percentage_match}
								role_deadline={role?.appl_close_date}
								role_location={role?.location}
							/>
						))}
					</InfiniteScroll>
				) : (
					!loading && (
						<div className="flex flex-col items-center justify-center my-12 text-center">
							<img src={confused_guy} width={500}></img>
							<h2 className="text-2xl font-bold">
								No job openings match the selected filters,
								please try again.
							</h2>
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default RoleListing;
