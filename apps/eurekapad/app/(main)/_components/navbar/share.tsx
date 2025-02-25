'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAction, useMutation, useQuery } from 'convex/react'
import { Mail, MoreVertical, PlusCircle, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'

interface ShareProps {
  document: Doc<'documents'>
}

const formSchema = z.object({
  shares: z.array(
    z.object({
      email: z.string().email(),
      role: z.enum(['viewer', 'editor']),
    }),
  ),
})

export const Share = ({ document }: ShareProps) => {
  'use no memo'
  const [open, setOpen] = useState(false)
  const share = useAction(api.documentPermissions.share)

  const currentShares = useQuery(api.documentPermissions.getDocumentPermissions, {
    documentId: document._id,
  })
  const pendingInvites = useQuery(api.documentPermissions.getPendingInvites, {
    documentId: document._id,
  })
  const getUserFromId = useAction(api.utils.users.getUserFromId)

  const removePendingInvite = useMutation(api.documentPermissions.removePendingInvite)
  const removePermissions = useMutation(api.documentPermissions.removePermissions)
  const updateRole = useMutation(api.documentPermissions.updateRole)

  const [sharedWith, setSharedWith] = useState<
    { id: string; email: string; name: string; image: string; isEditor: boolean }[]
  >([])

  useEffect(() => {
    if (currentShares) {
      Promise.all(
        currentShares.map(async shareInfo => {
          const user = await getUserFromId({ id: shareInfo.userId })
          return {
            id: shareInfo.userId,
            email: user.email!,
            name: user.fullName ?? user.email!,
            image: user.image,
            isEditor: shareInfo.isEditor,
          }
        }),
      ).then(setSharedWith)
    }
  }, [currentShares])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shares: [{ email: '', role: 'editor' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'shares',
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await share({
      id: document._id,
      shares: values.shares.map(share => ({
        email: share.email,
        isEditor: share.role === 'editor',
      })),
    })
    setOpen(false)
    toast.success('Document shared successfully')
  }

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={e => e.preventDefault()}>
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>
        {sharedWith.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium">Shared with</h3>
            <div className="space-y-3 mt-4">
              {sharedWith.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email} ({user.isEditor ? 'Editor' : 'Viewer'})
                      </span>
                    </div>
                  </div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          updateRole({ documentId: document._id, userId: user.id, isEditor: !user.isEditor }).then(
                            () => {
                              toast.success(`${user.name} is now a ${user.isEditor ? 'Viewer' : 'Editor'}`)
                            },
                          )
                        }}
                      >
                        Make {user.isEditor ? 'Viewer' : 'Editor'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          removePermissions({ documentId: document._id, userId: user.id }).then(() => {
                            toast.success(`${user.name} removed from document`)
                          })
                        }
                      >
                        Remove access
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingInvites && pendingInvites.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium">Pending Invites</h3>
            <div className="space-y-3 mt-2">
              {pendingInvites.map(invite => (
                <div key={invite._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Mail className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{invite.email}</span>
                      <span className="text-xs text-muted-foreground">{invite.isEditor ? 'Editor' : 'Viewer'}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      removePendingInvite({ id: invite._id }).then(() => {
                        toast.success('Invite removed')
                      })
                    }
                  >
                    Cancel
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-4">
                <FormField
                  control={form.control}
                  name={`shares.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Email address</FormLabel>}
                      <FormControl>
                        <Input placeholder="jane@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`shares.${index}.role`}
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Role</FormLabel>}
                      <Select onValueChange={field.onChange} defaultValue={field.value ?? 'editor'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[100000]">
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    className={cn(index === 0 && 'invisible')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="flow-root mt-4">
              <Button
                variant="outline"
                onClick={() => append({ email: '', role: 'editor' })}
                className="w-fit float-left"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add more
              </Button>
              <Button className="float-right" type="submit">
                Share
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
