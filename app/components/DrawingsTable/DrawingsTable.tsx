import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import { useMemo, useState } from 'react';
import {
  MantineReactTable,
  createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMantineReactTable,
} from 'mantine-react-table';
import {
  Box,
  Button,
  ActionIcon,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { IconUserPlus, IconEdit, IconTrash } from '@tabler/icons-react';

interface Drawing {
  id: string;
  raffleId: string;
  drawDate: Date;
  description: string;
  subRows?: Prize[];
}

interface Prize {
  id: string;
  drawingId: string;
  name: string;
  description: string;
  subRows?: never;
}

type RowData = Drawing | Prize;

const DrawingsTable = () => {
  const theme = useMantineTheme();
  const [creatingRowIndex, setCreatingRowIndex] = useState<number | undefined>();

  const columns = useMemo<MRT_ColumnDef<RowData>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      enableEditing: false,
      size: 80,
    },
    {
      accessorKey: 'raffleId',
      header: 'Raffle ID',
      enableEditing: false,
      size: 120,
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return value ?? '-';
      },
    },
    {
      accessorKey: 'drawingId',
      header: 'Drawing ID',
      enableEditing: false,
      size: 120,
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return value ?? '-';
      }
    },
    {
      accessorKey: 'drawDate',
      header: 'Draw Date',
      size: 100,
      editVariant: 'text',
      mantineEditTextInputProps: {
        type: 'date',
      },
      Cell: ({ cell }) => {
        const value = cell.getValue<Date>();
        return value ? value.toLocaleDateString() : '-';
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      size: 250,
    },
    {
      accessorKey: 'name',
      header: 'Prize Name',
      size: 120,
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return value ?? '-';
      }
    },
  ], []);

  const { mutateAsync: createDrawing } = useCreateDrawing();
  const { data: fetchedDrawings = [] } = useGetDrawings();
  const { mutateAsync: updateDrawing } = useUpdateDrawing();
  const { mutateAsync: deleteDrawing } = useDeleteDrawing();
  const { mutateAsync: createPrize } = useCreatePrize();
  const { mutateAsync: updatePrize } = useUpdatePrize();
  const { mutateAsync: deletePrize } = useDeletePrize();

  const handleCreateSubRow = (row: MRT_Row<RowData>) => {
    if (!isDrawing(row.original)) return; // Ensure it's a Drawing row
    setCreatingRowIndex(row.index + 1);
    table.setCreatingRow(
      createRow(
        table,
        {
          id: '',
          drawingId: row.original.id,
          name: '',
          description: '',
        } as Prize,
        -1,
        row.depth + 1,
      )
    );
  };

  const handleSaveRow: MRT_TableOptions<RowData>['onEditingRowSave'] = async ({ values, table }) => {
    if (isDrawing(values)) {
      await updateDrawing(values);
    } else if (isPrize(values)) {
      await updatePrize(values);
    }
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row: MRT_Row<RowData>) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (isDrawing(row.original)) {
        deleteDrawing(row.original.id);
      } else if (isPrize(row.original)) {
        deletePrize(row.original.id);
      }
    }
  };

  const table = useMantineReactTable<RowData>({
    columns,
    data: fetchedDrawings as RowData[],
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableColumnPinning: true,
    enableEditing: true,
    enableExpanding: true,
    positionCreatingRow: creatingRowIndex,
    getRowId: (row) => row.id,
    mantineTableBodyRowProps: ({ row }) => ({
      style: {
        backgroundColor: row.depth ? theme.colors.gray[0] : undefined,
      },
    }),
    onCreatingRowSave: async ({ values, row, table }) => {
      if (isDrawing(values)) {
        await createDrawing(values);
      } else if (isPrize(values)) {
        await createPrize(values);
      }
      table.setCreatingRow(null);
    },
    onEditingRowSave: handleSaveRow,
    renderRowActions: ({ row, table }) => (
      <Box style={{ display: 'flex', gap: '0.5rem' }}>
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit size="1rem" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash size="1rem" />
          </ActionIcon>
        </Tooltip>
        {isDrawing(row.original) && (
          <Tooltip label="Add Prize">
            <ActionIcon onClick={() => handleCreateSubRow(row)}>
              <IconUserPlus size="1rem" />
            </ActionIcon>
          </Tooltip>
        )}
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        leftSection={<IconUserPlus size="1rem" />}
        onClick={() => {
          setCreatingRowIndex(table.getRowModel().rows.length);
          table.setCreatingRow(true);
        }}
      >
        Create New Drawing
      </Button>
    ),
    initialState: {
      expanded: true,
      pagination: { pageSize: 20, pageIndex: 0 },
    },
  });

  return <MantineReactTable table={table} />;
};

// Type Guards
function isDrawing(row: RowData): row is Drawing {
  return 'raffleId' in row;
}

function isPrize(row: RowData): row is Prize {
  return 'drawingId' in row;
}

// Mutation and Query Hooks
function useCreateDrawing() {
    const queryClient = useQueryClient();
    return useMutation<Drawing, Error, Drawing>({
      mutationFn: async (drawing: Drawing) => {
        console.info('create drawing', drawing);
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Return the drawing object
        return drawing;
      },
      onSuccess: (newDrawing: Drawing) => {
        queryClient.setQueryData(['drawings'], (prevDrawings: Drawing[] = []) => [
          ...prevDrawings,
          { ...newDrawing, subRows: [] },
        ]);
      },
    });
  }

  function useUpdateDrawing() {
    const queryClient = useQueryClient();
    return useMutation<Drawing, Error, Drawing>({
      mutationFn: async (drawing: Drawing) => {
        console.info('update drawing', drawing);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Return the updated drawing
        return drawing;
      },
      onSuccess: (updatedDrawing: Drawing) => {
        queryClient.setQueryData(['drawings'], (prevDrawings: Drawing[] = []) =>
          prevDrawings.map((drawing) =>
            drawing.id === updatedDrawing.id ? { ...drawing, ...updatedDrawing } : drawing
          )
        );
      },
    });
  }

  function useDeleteDrawing() {
    const queryClient = useQueryClient();
    return useMutation<string, Error, string>({
      mutationFn: async (drawingId: string) => {
        console.info('delete drawing', drawingId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Return the ID of the deleted drawing
        return drawingId;
      },
      onSuccess: (deletedDrawingId: string) => {
        queryClient.setQueryData(['drawings'], (prevDrawings: Drawing[] = []) =>
          prevDrawings.filter((drawing) => drawing.id !== deletedDrawingId)
        );
      },
    });
  }

  function useCreatePrize() {
    const queryClient = useQueryClient();
    return useMutation<Prize, Error, Prize>({
      mutationFn: async (prize: Prize) => {
        console.info('create prize', prize);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Return the prize object
        return prize;
      },
      onSuccess: (newPrize: Prize) => {
        queryClient.setQueryData(['drawings'], (prevDrawings: Drawing[] = []) =>
          prevDrawings.map((drawing) =>
            drawing.id === newPrize.drawingId
              ? { ...drawing, subRows: [...(drawing.subRows || []), newPrize] }
              : drawing
          )
        );
      },
    });
  }

  function useUpdatePrize() {
    const queryClient = useQueryClient();
    return useMutation<Prize, Error, Prize>({
      mutationFn: async (prize: Prize) => {
        console.info('update prize', prize);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Return the updated prize
        return prize;
      },
      onSuccess: (updatedPrize: Prize) => {
        queryClient.setQueryData(['drawings'], (prevDrawings: Drawing[] = []) =>
          prevDrawings.map((drawing) => {
            if (drawing.id === updatedPrize.drawingId) {
              return {
                ...drawing,
                subRows: drawing.subRows?.map((prize) =>
                  prize.id === updatedPrize.id ? { ...prize, ...updatedPrize } : prize
                ),
              };
            }
            return drawing;
          })
        );
      },
    });
  }
  

  function useDeletePrize() {
    const queryClient = useQueryClient();
    return useMutation<string, Error, string>({
      mutationFn: async (prizeId: string) => {
        console.info('delete prize', prizeId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Return the ID of the deleted prize
        return prizeId;
      },
      onSuccess: (deletedPrizeId: string) => {
        queryClient.setQueryData(['drawings'], (prevDrawings: Drawing[] = []) =>
          prevDrawings.map((drawing) => ({
            ...drawing,
            subRows: drawing.subRows?.filter((prize) => prize.id !== deletedPrizeId),
          }))
        );
      },
    });
  }  

function useGetDrawings() {
  return useQuery<Drawing[]>({
    queryKey: ['drawings'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Fetch your data here
      return Promise.resolve([]); // Replace with actual data
    },
  });
}

const queryClient = new QueryClient();

const DrawingsTableWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <DrawingsTable />
  </QueryClientProvider>
);

export default DrawingsTableWithProviders;