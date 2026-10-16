import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ChildCreate, ChildUpdate, ChildFilter } from '@shared/schemas/children'

export const useChildren = (filter: ChildFilter) =>
  useQuery({
    queryKey: ['children', filter],
    queryFn: () => api.children.list(filter)
  })

export const useChild = (id: string) =>
  useQuery({
    queryKey: ['child', id],
    queryFn: () => api.children.get(id),
    enabled: Boolean(id)
  })

export const useClassrooms = () =>
  useQuery({
    queryKey: ['classrooms'],
    queryFn: () => api.classrooms.list()
  })

export const useCreateChild = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: ChildCreate) => api.children.create(v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['children'] })
      qc.invalidateQueries({ queryKey: ['children-count'] })
      qc.invalidateQueries({ queryKey: ['children-attendance'] })
    }
  })
}

export const useUpdateChild = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: ChildUpdate) => api.children.update(v),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['children'] })
      if (data?.id) qc.invalidateQueries({ queryKey: ['child', data.id] })
    }
  })
}
