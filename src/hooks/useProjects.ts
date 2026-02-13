
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectState } from '../../types';

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  const createProject = useMutation({
    mutationFn: async ({ name, data }: { name: string; data: ProjectState }) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, data }),
      });
      if (!res.ok) throw new Error('Failed to create project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, name, data, version }: { id: string; name: string; data: ProjectState, version: number }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, data, version }),
      });
      
      if (res.status === 409) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Version mismatch');
      }
      
      if (!res.ok) throw new Error('Failed to update project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projectHistory'] });
    },
  });

  return { projectsQuery, createProject, updateProject };
}
