import { useState } from 'react';
import UserHeader from '../../features/management/user/UserHeader';
import UserSearchFilter from '../../features/management/user/UserSearchFilter';
import UsersTable from '../../features/management/user/UsersTable';

export default function UsersManagementPage() {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const handleFilterChange = (next: { q?: string; role?: string; status?: string }) => {
        setSearch(next.q ?? '');
        setSort(next.role ?? '');
        setPage(1);
    };

    return (
        <div>
            <UserHeader />
            <UserSearchFilter q={search} role={sort} onChange={handleFilterChange} />
            <UsersTable
                search={search}
                sort={sort}
                page={page}
                limit={limit}
                onPageChange={(p) => setPage(p)}
                onLimitChange={(n) => { setLimit(n); setPage(1); }}
            />
        </div>
    );
}
