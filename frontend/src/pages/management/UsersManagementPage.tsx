import { useState, useEffect } from 'react';
import UserHeader from '../../features/management/user/UserHeader';
import UserSearchFilter from '../../features/management/user/UserSearchFilter';
import UsersTable from '../../features/management/user/UsersTable';

export default function UsersManagementPage() {
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [roles, setRoles] = useState('');
    const [isActive, setIsActive] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Debounce search input - wait 500ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1); // Reset to page 1 when search changes
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleFilterChange = (next: { q?: string; roles?: string; isActive?: string }) => {
        if (next.q !== undefined) setSearchInput(next.q);
        if (next.roles !== undefined) {
            setRoles(next.roles);
            setPage(1);
        }
        if (next.isActive !== undefined) {
            setIsActive(next.isActive);
            setPage(1);
        }
    };

    return (
        <div>
            <UserHeader />
            <UserSearchFilter q={searchInput} roles={roles} isActive={isActive} onChange={handleFilterChange} />
            <UsersTable
                search={search}
                roles={roles}
                isActive={isActive}
                page={page}
                limit={limit}
                onPageChange={(p) => setPage(p)}
                onLimitChange={(n) => { setLimit(n); setPage(1); }}
            />
        </div>
    );
}
