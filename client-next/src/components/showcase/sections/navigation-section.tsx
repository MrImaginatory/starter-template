import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Pagination,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { Demo, ShowcaseSection } from '../shared'

export function NavigationSection() {
  const [page, setPage] = useState(3)

  return (
    <ShowcaseSection
      id="navigation"
      title="Navigation"
      description="Tabs, breadcrumbs and pagination — all keyboard accessible with visible focus states."
    >
      <Demo title="Tabs — underline" layout="stack">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p className="text-sm text-fg-muted">Project summary, timeline and team details live here.</p>
          </TabsContent>
          <TabsContent value="payments">
            <p className="text-sm text-fg-muted">Billing history, expenses and payment records.</p>
          </TabsContent>
          <TabsContent value="settings">
            <p className="text-sm text-fg-muted">Deadlines, reminders and recurring schedules.</p>
          </TabsContent>
        </Tabs>
      </Demo>

      <Demo title="Tabs — pills" layout="stack">
        <Tabs defaultValue="all" variant="pills">
          <TabsList>
            <TabsTrigger value="all">All projects</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="sent">Active</TabsTrigger>
            <TabsTrigger value="paid">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <p className="text-sm text-fg-muted">Showing all 128 projects.</p>
          </TabsContent>
          <TabsContent value="draft"><p className="text-sm text-fg-muted">3 drafts.</p></TabsContent>
          <TabsContent value="sent"><p className="text-sm text-fg-muted">12 in progress.</p></TabsContent>
          <TabsContent value="paid"><p className="text-sm text-fg-muted">113 completed.</p></TabsContent>
        </Tabs>
      </Demo>

      <Demo title="Breadcrumbs">
        <div className="w-full space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#navigation">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#navigation">Team</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Ada Lovelace</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#navigation">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#navigation">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>PRJ-001</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </Demo>

      <Demo title="Pagination">
        <div className="flex w-full justify-center py-1">
          <Pagination page={page} totalPages={25} onPageChange={setPage} />
        </div>
      </Demo>
    </ShowcaseSection>
  )
}
