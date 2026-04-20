import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    DEFAULT_READING_DENSITY_MODE,
    READING_DENSITY,
    type ReadingDensityMode,
} from '@/constants/readingDensity';
import { storage } from '@/infra/storage';

const STORAGE_KEY = '@istqb_reading_density_mode';
const QUERY_KEY = ['readingDensityMode'];

function isReadingDensityMode(value: string): value is ReadingDensityMode {
    return value in READING_DENSITY;
}

async function getStoredReadingDensityMode(): Promise<ReadingDensityMode> {
    const rawValue = await storage.getItem(STORAGE_KEY);

    if (!rawValue || !isReadingDensityMode(rawValue)) {
        return DEFAULT_READING_DENSITY_MODE;
    }

    return rawValue;
}

export function useReadingPreferences() {
    const queryClient = useQueryClient();

    const { data: mode = DEFAULT_READING_DENSITY_MODE, isPending } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: getStoredReadingDensityMode,
        initialData: DEFAULT_READING_DENSITY_MODE,
        staleTime: Infinity,
    });

    const saveMode = useMutation({
        mutationFn: async (nextMode: ReadingDensityMode) => {
            await storage.setItem(STORAGE_KEY, nextMode);
            return nextMode;
        },
        onSuccess: (nextMode) => {
            queryClient.setQueryData(QUERY_KEY, nextMode);
        },
    });

    const setMode = (nextMode: ReadingDensityMode) => {
        if (nextMode === mode || saveMode.isPending) {
            return;
        }

        saveMode.mutate(nextMode);
    };

    return {
        mode,
        density: READING_DENSITY[mode],
        isLoadingMode: isPending,
        isSavingMode: saveMode.isPending,
        setMode,
    };
}
