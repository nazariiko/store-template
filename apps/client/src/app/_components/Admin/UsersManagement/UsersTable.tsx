"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TypographyH4 } from "@/components/ui/typography";
import {
  IGetAllUserRolesResponse,
  IGetUsersListFilters,
  IGetUsersResponse,
  IUser,
} from "@repo/dto";
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, EditIcon, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { getUsers } from "@/lib/api/admin/user";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelect } from "@/components/ui/multi-select";
import Link from "next/link";

export function UsersTable({
  data: initialData,
  userRoles,
}: {
  data: IGetUsersResponse;
  userRoles: IGetAllUserRolesResponse[];
}) {
  const rolesList = userRoles.map((userRole) => {
    return {
      value: userRole.alias,
      label: userRole.uaName,
    };
  });
  const [data, setData] = useState(initialData.data);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(initialData.hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(false);

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneNumberFilter, setPhoneNumberFilter] = useState("");
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([]);

  const handlePreviousPage = async () => {
    const currentPage = page;
    setPage(page - 1);
    setIsLoading(true);
    const users = await getUsers({
      pageNumber: currentPage - 1,
      limit: 10,
      filters: getFiltersObject(
        nameFilter,
        emailFilter,
        phoneNumberFilter,
        selectedUserRoles,
      ),
    });
    setIsLoading(false);
    setData(users.data);
    setHasNextPage(users.hasNextPage);
  };

  const handleNextPage = async () => {
    const currentPage = page;
    setPage(page + 1);
    setIsLoading(true);
    const users = await getUsers({
      pageNumber: currentPage + 1,
      limit: 10,
      filters: getFiltersObject(
        nameFilter,
        emailFilter,
        phoneNumberFilter,
        selectedUserRoles,
      ),
    });
    setIsLoading(false);
    setData(users.data);
    setHasNextPage(users.hasNextPage);
  };

  const getFiltersObject = (
    name: string,
    email: string,
    phoneNumber: string,
    userRoleAliases: string[],
  ): IGetUsersListFilters => {
    const filters: IGetUsersListFilters = {};
    if (name) {
      filters.name = name;
    }
    if (email) {
      filters.email = email;
    }
    if (phoneNumber) {
      filters.phoneNumber = phoneNumber;
    }
    if (userRoleAliases.length) {
      filters.userRoleIds = userRoleAliases.map((alias) => {
        return userRoles.find((userRole) => userRole.alias === alias)
          ?.id as number;
      });
    }

    return filters;
  };

  const debouncedApiCall = useMemo(() => {
    return debounce(async (name, email, phoneNumber, userRoles) => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }
      if (isLoading) return;
      setPage(1);
      setIsLoading(true);
      const users = await getUsers({
        pageNumber: 1,
        limit: 10,
        filters: getFiltersObject(name, email, phoneNumber, userRoles),
      });
      setIsLoading(false);
      setData(users.data);
      setHasNextPage(users.hasNextPage);
    }, 500);
  }, []);

  useEffect(() => {
    debouncedApiCall(
      nameFilter,
      emailFilter,
      phoneNumberFilter,
      selectedUserRoles,
    );
  }, [
    nameFilter,
    emailFilter,
    phoneNumberFilter,
    selectedUserRoles,
    debouncedApiCall,
  ]);

  useEffect(() => {
    return () => {
      debouncedApiCall.cancel();
    };
  }, [debouncedApiCall]);

  const columns: ColumnDef<Omit<IUser, "googleId" | "passwordHash">>[] = [
    {
      accessorKey: "name",
      header: "Ім'я",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Пошта",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phoneNumber",
      header: "Номер телефону",
      cell: ({ row }) => <div>{row.getValue("phoneNumber") || "-"}</div>,
    },
    {
      id: "userUserRoles",
      header: "Ролі",
      cell: ({ row }) => {
        const userUserRoles = row.original.userUserRoles;
        if (!userUserRoles || !userUserRoles?.length) {
          return <div>-</div>;
        }
        const roles = userUserRoles
          .map((role) => role.userRole?.uaName)
          .join(", ");
        return <div>{roles || "-"}</div>;
      },
    },
    {
      accessorKey: "isEmailVerified",
      header: "Пошта підтверджена",
      cell: ({ row }) => (
        <div>{row.getValue("isEmailVerified") ? "Так" : "Ні"}</div>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 100,
      maxSize: 100,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/admin/settings/users/${row.original.id}`}>
              <Button variant="ghost" size="icon">
                <EditIcon />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-w-full">
      <div className="mb-4 flex items-center justify-between">
        <TypographyH4>Користувачі</TypographyH4>
      </div>
      <div className="rounded-md border-[1px] p-3">
        <Table className="table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>

                <TableRow key={`${headerGroup.id}-filter`}>
                  <TableHead>
                    <div className="flex w-full max-w-sm items-center">
                      <Search className="h-4 w-4 opacity-50" />
                      <Input
                        placeholder=""
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="w-full max-w-xs rounded-none border-none bg-transparent pl-1.5 text-sm font-normal shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-transparent"
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex w-full max-w-sm items-center">
                      <Search className="h-4 w-4 opacity-50" />
                      <Input
                        placeholder=""
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                        className="w-full max-w-xs rounded-none border-none bg-transparent pl-1.5 text-sm font-normal shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-transparent"
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex w-full max-w-sm items-center">
                      <Search className="h-4 w-4 opacity-50" />
                      <Input
                        placeholder=""
                        value={phoneNumberFilter}
                        onChange={(e) => setPhoneNumberFilter(e.target.value)}
                        className="w-full max-w-xs rounded-none border-none bg-transparent pl-1.5 text-sm font-normal shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-transparent"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="py-1">
                    <div className="flex w-full max-w-sm items-center">
                      <MultiSelect
                        options={rolesList}
                        onValueChange={setSelectedUserRoles}
                        defaultValue={selectedUserRoles}
                        placeholder="Оберіть ролі"
                        variant="default"
                        maxCount={0}
                      />
                    </div>
                  </TableHead>
                  <TableHead />
                  <TableHead />
                </TableRow>
              </React.Fragment>
            ))}
          </TableHeader>
          <TableBody>
            {
              // -- PERHAPS IT WOULD BE BETTER WITHOUT SKELETON
              // isLoading ? (
              //   <TableRow className="hover:bg-transparent">
              //     <TableCell colSpan={columns.length} className="px-0 pt-3 pb-0">
              //       <PreloadDataSkeleton />
              //     </TableCell>
              //   </TableRow>
              // ):
              table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    Немає даних
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div>
      <div className="mt-3 flex w-full items-center justify-end gap-2">
        <Button
          size={"icon"}
          variant={"ghost"}
          disabled={page === 1 || isLoading}
          onClick={handlePreviousPage}
        >
          <ChevronLeft />
        </Button>
        <div className="bg-primary flex h-[36px] w-[36px] items-center justify-center rounded-md">
          <span className="text-primary-foreground">{page}</span>
        </div>
        <Button
          size={"icon"}
          variant={"ghost"}
          disabled={!hasNextPage || isLoading}
          onClick={handleNextPage}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

function PreloadDataSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-[150px] w-full" />
    </div>
  );
}
