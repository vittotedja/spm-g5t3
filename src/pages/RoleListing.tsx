import React, {useEffect, useState} from 'react';
import RoleCard from '../components/RoleCard';
import {getAsync} from '../utilities/Services';
import FilterBox from '../components/FilterBox';
import SortComponent from '../components/SortComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useAuth} from '../utilities/Auth';
import LoadingState from '../components/loadingState';

interface Role {
	role_name: string;
	role_desc: string;
	role_id: number;
	listing_id: number;
	creation_date: string | null;
	updated_at: string | null;
	deleted_at: string | null;
	application_close_date: string | null;
	role_department: string;
	'deleted?': boolean;
	deleted_At: string | null;
	listing_location: string | null;
	percentage_match: number;
}
interface FilterItem {
	name: string;
	values: string[];
}

const RoleListing: React.FC = () => {
	const [roles, setRoles] = useState<Role[]>([]);
	const [firstLoading, setFirstLoading] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState(1);
	const [sortField, setSortField] = useState('creation_date');
	const [order, setOrder] = useState('asc');
	const [hasMore, setHasMore] = useState(true);
	const [filters, setFilters] = useState<FilterItem[]>([]);
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string[]>
	>({});

	const auth = useAuth();

	const fetchFirst = async () => {
		setPage(1); // Reset to the first page
		setRoles([]); // Clear existing roles
		setHasMore(true); // Reset hasMore
		setLoading(true);
		const response = await getAsync(
			`api/staff_role?staff_id=${
				auth?.staffId
			}&page=1&limit=5&sort_field=${sortField}&order=${order}&filters=${JSON.stringify(
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
		if (data.pagination.current_page >= data.pagination.total_pages) {
			setHasMore(false);
		} else {
			setHasMore(true);
		}
		setRoles(data.data);
		setLoading(false);
		setFirstLoading(false);
	};

	const fetchMore = async () => {
		if (!hasMore || loading) return;
		setLoading(true);
		var response;
		if (page === 1) {
			response = await getAsync(
				`api/staff_role?staff_id=${
					auth?.staffId
				}&page=${2}&limit=5&sort_field=${sortField}&order=${order}&filters=${JSON.stringify(
					selectedFilters
				)}`
			);
			setPage(2);
		} else {
			response = await getAsync(
				`api/staff_role?staff_id=${
					auth?.staffId
				}&page=${page}&limit=5&sort_field=${sortField}&order=${order}&filters=${JSON.stringify(
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
		<>
			{firstLoading ? (
				<div>
					<LoadingState />
				</div>
			) : (
				<div className="flex justify-around mt-4">
					<FilterBox
						filters={filters}
						onFilterChange={handleFilterChange}
						selectedFilters={selectedFilters}
					/>
					<div className="flex-col justify-center w-4/6">
						<h2 className="text-2xl font-bold text-left">
							Role Listings
						</h2>
						<SortComponent
							options={[
								{value: 'creation_date', name: 'Created At'},
								{value: 'role_name', name: 'Role Name'},
								{value: 'dept', name: 'Department'},
								{
									value: 'application_close_date',
									name: 'Application Deadline',
								},
							]}
							onSortFieldChange={handleSortFieldChange}
							onOrderChange={handleOrderChange}
						/>
						{roles.length > 0 && !loading ? (
							<InfiniteScroll
								dataLength={roles.length}
								next={fetchMore}
								hasMore={hasMore}
								loader={<span></span>}
							>
								{roles.map((role) => (
									<RoleCard
										key={role.listing_id}
										listing_id={role.listing_id}
										role_id={role.role_id}
										role_name={role.role_name}
										role_department={role.role_department}
										listing_location={role.listing_location}
										role_percentage_match={
											role.percentage_match
										}
										role_deadline={
											role?.application_close_date
										}
									/>
								))}
							</InfiniteScroll>
						) : (
							!loading && (
								<div className="flex flex-col items-center justify-center my-12 text-center">
									<img
										src='https://ujjnudccckrqqtttlkoo.supabase.co/storage/v1/object/public/spm-assets/confused_guy.png'
										width={500}
										alt="Confused Guy"
									/>
									<h2 className="text-2xl font-bold">
										No job openings match the selected
										filters, please try again.
									</h2>
								</div>
							)
						)}
						{loading && <LoadingState />}
					</div>
				</div>
			)}
		</>
	);
};

export default RoleListing;
