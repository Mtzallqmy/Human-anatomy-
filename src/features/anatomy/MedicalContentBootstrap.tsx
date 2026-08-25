"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured } from "@/src/lib/supabase/client";
import { supabaseMedicalRepository } from "@/src/data-access/medical/supabaseMedicalRepository";
import { useContentStore } from "@/src/store/contentStore";
import { useViewerStore } from "@/src/store/viewerStore";

export function MedicalContentBootstrap() {
  const selectedSystemId = useViewerStore((state) => state.selectedSystemId);
  const setSystems = useContentStore((state) => state.setSystems);
  const setLoading = useContentStore((state) => state.setLoading);
  const setRemoteBundle = useContentStore((state) => state.setRemoteBundle);
  const fallbackToLocalData = useContentStore((state) => state.useFallback);
  const enabled = isSupabaseConfigured();

  const systemsQuery = useQuery({
    queryKey: ["medical-systems"],
    queryFn: () => supabaseMedicalRepository.getSystems(),
    enabled,
    staleTime: 15 * 60 * 1000,
  });
  const bundleQuery = useQuery({
    queryKey: ["medical-system-bundle", selectedSystemId],
    queryFn: () => supabaseMedicalRepository.getSystemBundle(selectedSystemId),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    setLoading(enabled && bundleQuery.isPending);
  }, [bundleQuery.isPending, enabled, setLoading]);

  useEffect(() => {
    if (systemsQuery.data) setSystems(systemsQuery.data);
  }, [setSystems, systemsQuery.data]);

  useEffect(() => {
    if (bundleQuery.data) setRemoteBundle(bundleQuery.data);
  }, [bundleQuery.data, setRemoteBundle]);

  useEffect(() => {
    const error = systemsQuery.error ?? bundleQuery.error;
    if (error)
      fallbackToLocalData(error instanceof Error ? error.message : "Medical content is unavailable.");
  }, [bundleQuery.error, fallbackToLocalData, systemsQuery.error]);

  return null;
}
