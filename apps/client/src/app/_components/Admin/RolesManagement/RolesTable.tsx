"use client";

import { CreateRoleModal } from "@/app/_components/Admin/RolesManagement/CreateRoleModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TypographyH4 } from "@/components/ui/typography";
import { checkUserPermission } from "@/lib/helpers/user.helpers";
import {
  IGetUserRightsResponse,
  IGetUserRolesWithIsEditableResponse,
  UserRight,
} from "@repo/dto";
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { EditIcon, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";

export function RolesTable({
  data: initialData,
  userRights,
}: {
  data: IGetUserRolesWithIsEditableResponse[];
  userRights: IGetUserRightsResponse[];
}) {
  const [data, setData] = useState(initialData);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] =
    useState<IGetUserRolesWithIsEditableResponse | null>(null);

  const canCreateRoles = checkUserPermission(UserRight.ROLE_RIGHTS_CHANGE);

  const columns: ColumnDef<IGetUserRolesWithIsEditableResponse>[] = [
    {
      accessorKey: "uaName",
      header: "Назва",
    },
    {
      accessorKey: "name",
      header: "Назва (англ.)",
    },
    {
      accessorKey: "rank",
      header: "Ранг",
    },
    {
      id: "actions",
      header: "",
      size: 100,
      maxSize: 100,
      cell: ({ row }) => {
        const role = row.original;
        if (!role.isEditable) return null;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedRole(role);
                setIsEditOpen(true);
              }}
            >
              <EditIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedRole(role);
                setIsDeleteOpen(true);
              }}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onCreate = (newRole: IGetUserRolesWithIsEditableResponse) => {
    setData([...data, newRole]);
    setIsCreateOpen(false);
  };

  const onEdit = (updatedRole: IGetUserRolesWithIsEditableResponse) => {
    setData(
      data.map((role) => (role.id === updatedRole.id ? updatedRole : role)),
    );
    setIsEditOpen(false);
  };

  const onDelete = (id: number) => {
    setData(data.filter((role) => role.id !== id));
    setIsDeleteOpen(false);
  };

  return (
    <div className="max-w-full">
      <div className="mb-4 flex items-center justify-between">
        <TypographyH4>Ролі користувача</TypographyH4>
        {canCreateRoles && (
          <Button size="icon" onClick={() => setIsCreateOpen(true)}>
            <PlusIcon />
          </Button>
        )}
      </div>
      <div className="rounded-md border-[1px] p-3">
        <Table className="table-fixed sm:table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
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
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateRoleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={onCreate}
        userRights={userRights}
      />
    </div>
  );
}
