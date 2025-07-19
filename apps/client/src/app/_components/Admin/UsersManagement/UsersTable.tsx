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
import { IGetUsersListFilters, IGetUsersResponse, IUser } from "@repo/dto";
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { EditIcon, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { getUsers } from "@/lib/api/admin/user";

export function UsersTable({ data: initialData }: { data: IGetUsersResponse }) {
  const [data, setData] = useState(initialData.data);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(initialData.hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(false);

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneNumberFilter, setPhoneNumberFilter] = useState("");
  const [selectedUserRolesIds, setSelectedUserRolesIds] = useState<number[]>(
    [],
  );

  const getFiltersObject = (
    name: string,
    email: string,
    phoneNumber: string,
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
    if (selectedUserRolesIds.length) {
      filters.userRoleIds = selectedUserRolesIds;
    }

    return filters;
  };

  const debouncedApiCall = useMemo(() => {
    return debounce(async (name, email, phoneNumber) => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }
      if (isLoading) return;
      setPage(1);
      setIsLoading(true);
      const users = await getUsers({
        pageNumber: 1,
        limit: 15,
        filters: getFiltersObject(name, email, phoneNumber),
      });
      setIsLoading(false);
      setData(users.data);
      setHasNextPage(users.hasNextPage);
    }, 500);
  }, []);

  useEffect(() => {
    debouncedApiCall(nameFilter, emailFilter, phoneNumberFilter);
  }, [nameFilter, emailFilter, phoneNumberFilter, debouncedApiCall]);

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
            {" "}
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <EditIcon />
            </Button>
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
                  <TableHead>
                    {/* <MultiSelect
                      options={userRoles.map((role) => ({
                        value: role.id.toString(),
                        label: role.uaName,
                      }))}
                      onChange={(values) =>
                        setSelectedRoles(values.map((v) => parseInt(v)))
                      }
                      value={selectedRoles.map((id) => id.toString())}
                      placeholder="Select roles..."
                      className="w-full max-w-xs text-sm"
                    /> */}
                  </TableHead>
                  <TableHead />
                  <TableHead />
                </TableRow>
              </React.Fragment>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
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
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
