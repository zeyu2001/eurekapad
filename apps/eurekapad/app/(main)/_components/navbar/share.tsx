'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from 'convex/react'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'

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

// Disable react-compiler to fix form validation issue: https://github.com/shadcn-ui/ui/issues/555
export const Share = ({ document: document }: ShareProps) => {
  'use no memo'
  const [open, setOpen] = useState(false)
  const [numShares, setNumShares] = useState(1)
  const share = useMutation(api.documentPermissions.share)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shares: [{ email: '', role: 'editor' }], // start with one row
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    share({
      id: document._id,
      shares: values.shares.map(share => ({ email: share.email, isEditor: share.role === 'editor' })),
    })
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 space-y-4">
            {Array.from({ length: numShares }).map((_, i) => (
              <div className="grid grid-cols-2 gap-4" key={i}>
                <FormField
                  control={form.control}
                  name={`shares.${i}.email`}
                  render={({ field }) => (
                    <FormItem>
                      {i === 0 && <FormLabel>Email address</FormLabel>}
                      <FormControl>
                        <Input placeholder="jane@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`shares.${i}.role`}
                  render={({ field }) => (
                    <FormItem>
                      {i === 0 && <FormLabel>Role</FormLabel>}
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
              </div>
            ))}
            <div className="flow-root mt-4">
              <Button variant="outline" onClick={() => setNumShares(numShares + 1)} className="w-fit float-left">
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
