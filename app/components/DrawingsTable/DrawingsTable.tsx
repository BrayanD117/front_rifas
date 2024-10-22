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
  Select,
} from '@mantine/core';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { IconUserPlus, IconEdit, IconTrash } from '@tabler/icons-react';

// Interfaces
interface DrawType {
  id: string;
  name: string;
}

interface Drawing {
  id: string;
  raffleId: string;
  drawTypeId: string;
  drawDate: Date;
  description: string;
  subRows?: Prize[];
}

interface Prize {
  id: string;
  drawingId: string;
  name: string;
  specifications: string;
  commercialValuation: string;
  subRows?: never;
}

type RowData = Drawing | Prize;

// Componente principal
const DrawingsTable = () => {
  const theme = useMantineTheme();
  const [creatingRowIndex, setCreatingRowIndex] = useState<number | undefined>();
  const [editedRowData, setEditedRowData] = useState<RowData | null>(null);

  // Obtener los tipos de sorteos
  const { data: drawTypes = [] } = useGetDrawTypes();

  // Definir columnas
  const columns = useMemo<MRT_ColumnDef<RowData>[]>(() => [
    // Columna para 'drawTypeId' con Select
    {
      accessorKey: 'drawTypeId',
      header: 'Tipo de Sorteo',
      size: 200,
      Cell: ({ cell, row }) => {
        if (isDrawing(row.original)) {
          const drawTypeId = cell.getValue<string>();
          const drawType = drawTypes.find((dt) => dt.id === drawTypeId);
          return drawType ? drawType.name : 'Selecciona un tipo';
        }
        return '';
      },
      Edit: ({ cell, row, table }) => {
        if (isDrawing(row.original)) {
          return (
            <Select
              data={drawTypes.map((dt) => ({ value: dt.id, label: dt.name }))}
              value={cell.getValue<string>() || ''}
              onChange={(value) => {
                const updatedRow = { ...row.original, drawTypeId: value || '' };
                setEditedRowData(updatedRow);
              }}
            />
          );
        }
        return null;
      },
    },
    // Columna para 'drawDate'
    {
      accessorKey: 'drawDate',
      header: 'Fecha del Sorteo',
      size: 100,
      editVariant: 'text',
      mantineEditTextInputProps: {
        type: 'date',
      },
      Cell: ({ cell, row }) => {
        if (isDrawing(row.original)) {
          const value = cell.getValue<Date>();
          return value ? value.toLocaleDateString() : '-';
        }
        return '';
      },
    },
    // Columna para 'description'
    {
      accessorKey: 'description',
      header: 'Descripción',
      size: 250,
      Cell: ({ cell, row }) => {
        if (isDrawing(row.original)) {
          const value = cell.getValue<string>();
          return value ?? '-';
        }
        return '';
      },
    },
    // Columna para 'name' de Prize
    {
      accessorKey: 'name',
      header: 'Nombre del Premio',
      size: 120,
      Cell: ({ cell, row }) => {
        if (isPrize(row.original)) {
          const value = cell.getValue<string>();
          return value ?? '-';
        }
        return '';
      },
    },
    // Columna para 'specifications' de Prize
    {
      accessorKey: 'specifications',
      header: 'Especificaciones',
      size: 200,
      Cell: ({ cell, row }) => {
        if (isPrize(row.original)) {
          const value = cell.getValue<string>();
          return value ?? '-';
        }
        return '';
      },
    },
    // Columna para 'commercialValuation' de Prize
    {
      accessorKey: 'commercialValuation',
      header: 'Valor Comercial',
      size: 150,
      Cell: ({ cell, row }) => {
        if (isPrize(row.original)) {
          const value = cell.getValue<string>();
          return value ?? '-';
        }
        return '';
      },
    },
  ], [drawTypes]);

  // Hooks de mutación y consulta
  const { mutateAsync: createDrawing } = useCreateDrawing();
  const { data: fetchedDrawings = [] } = useGetDrawings();
  const { mutateAsync: updateDrawing } = useUpdateDrawing();
  const { mutateAsync: deleteDrawing } = useDeleteDrawing();
  const { mutateAsync: createPrize } = useCreatePrize();
  const { mutateAsync: updatePrize } = useUpdatePrize();
  const { mutateAsync: deletePrize } = useDeletePrize();

  // Función para crear subfilas (Prizes)
  const handleCreateSubRow = (row: MRT_Row<RowData>) => {
    if (!isDrawing(row.original)) return; // Asegurarse de que es una fila Drawing
    setCreatingRowIndex(row.index + 1);
    table.setCreatingRow(
      createRow(
        table,
        {
          id: '',
          drawingId: row.original.id,
          name: '',
          specifications: '',
          commercialValuation: '',
        } as Prize,
        -1,
        row.depth + 1,
      )
    );
  };

  // Función para guardar filas
  const handleSaveRow: MRT_TableOptions<RowData>['onEditingRowSave'] = async ({ values, table }) => {
    if (isDrawing(values)) {
      await updateDrawing(values);
    } else if (isPrize(values)) {
      await updatePrize(values);
    }
    table.setEditingRow(null);
  };

  // Función para confirmar eliminación
  const openDeleteConfirmModal = (row: MRT_Row<RowData>) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      if (isDrawing(row.original)) {
        deleteDrawing(row.original.id);
      } else if (isPrize(row.original)) {
        deletePrize(row.original.id);
      }
    }
  };

  // Configuración de la tabla
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
        <Tooltip label="Editar">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit size="1rem" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Eliminar">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash size="1rem" />
          </ActionIcon>
        </Tooltip>
        {isDrawing(row.original) && (
          <Tooltip label="Agregar Premio">
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
        Crear Nuevo Sorteo
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

// Funciones de mutación y consulta
function useGetDrawTypes() {
  return useQuery<DrawType[]>({
    queryKey: ['drawTypes'],
    queryFn: async () => {
      // Simula una llamada a la API para obtener los tipos de sorteos
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Reemplaza con tu lógica para obtener los datos reales
      return Promise.resolve([
        { id: '1', name: 'Tipo A' },
        { id: '2', name: 'Tipo B' },
        { id: '3', name: 'Tipo C' },
      ]);
    },
  });
}

//CREATE hook for creating a drawing
function useCreateDrawing() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (drawing: Drawing) => {
        console.info('create drawing', drawing);
        // Make your API request here
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
        return Promise.resolve();
      },
      onMutate: (newDrawing: Drawing) => {
        queryClient.setQueryData(['drawings'], (prevDrawings: Drawing[] = []) => {
          return [...prevDrawings, { ...newDrawing, id: `${prevDrawings.length + 1}` }];
        });
      },
    });
  }
  
  //READ hook for fetching drawings
  function useGetDrawings() {
    return useQuery<Drawing[]>({
      queryKey: ['drawings'],
      queryFn: async () => {
        // Simulate fetching drawings from API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return Promise.resolve([]);
      },
    });
  }
  
  //UPDATE hook for updating a drawing
  function useUpdateDrawing() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (drawing: Drawing) => {
        console.info('update drawing', drawing);
        // Make your API request here
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return Promise.resolve();
      },
      onMutate: (updatedDrawing: Drawing) => {
        queryClient.setQueryData(['drawings'], (prevDrawings: Drawing[] = []) => {
          return prevDrawings.map((d) =>
            d.id === updatedDrawing.id ? updatedDrawing : d,
          );
        });
      },
    });
  }
  
  //DELETE hook for deleting a drawing
  function useDeleteDrawing() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (drawingId: string) => {
        console.info('delete drawing', drawingId);
        // Make your API request here
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return Promise.resolve();
      },
      onMutate: (drawingId: string) => {
        queryClient.setQueryData(['drawings'], (prevDrawings: Drawing[] = []) => {
          return prevDrawings.filter((d) => d.id !== drawingId);
        });
      },
    });
  }

  function useCreatePrize() {
    const queryClient = useQueryClient();
    return useMutation<Prize, Error, Prize>({
      mutationFn: async (prize: Prize) => {
        console.info('create prize', prize);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Retornar el objeto prize
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
        // Retornar el objeto prize actualizado
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
        // Retornar el ID del prize eliminado
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


const queryClient = new QueryClient();

const DrawingsTableWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <DrawingsTable />
  </QueryClientProvider>
);

export default DrawingsTableWithProviders;