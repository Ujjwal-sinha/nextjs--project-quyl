"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Student {
  id: number
  name: string
  email: string
  course: string
  enrollmentDate: string
}

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const mockStudents: Student[] = [
      { id: 1, name: "vishal kumr", email: "alice@example.com", course: "Computer Science", enrollmentDate: "2023-01-15" },
      { id: 2, name: "Boobby", email: "bob@example.com", course: "Business Administration", enrollmentDate: "2023-02-01" },
      { id: 3, name: "Chan", email: "charlie@example.com", course: "Electrical Engineering", enrollmentDate: "2023-01-20" },
      { id: 4, name: "davin", email: "diana@example.com", course: "Psychology", enrollmentDate: "2023-02-10" },
      { id: 5, name: "chatty", email: "ethan@example.com", course: "Computer Science", enrollmentDate: "2023-03-05" },
    ];
    setStudents(mockStudents);
  }, [])

  const totalStudents = students.length
  const courseDistribution = students.reduce((acc: Record<string, number>, student) => {
    acc[student.course] = (acc[student.course] || 0) + 1;
    return acc;
  }, {});

  const courseData = Object.entries(courseDistribution).map(([name, value]) => ({ name, value }))

  const recentEnrollments = [...students]
    .sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        {Object.entries(courseDistribution).map(([course, count]) => (
          <Card key={course}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{course}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Tabs defaultValue="enrollment">
        <TabsList>
          <TabsTrigger value="enrollment">Enrollment Chart</TabsTrigger>
          <TabsTrigger value="recent">Recent Enrollments</TabsTrigger>
        </TabsList>
        <TabsContent value="enrollment">
          <Card>
            <CardHeader>
              <CardTitle>Course Enrollment Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentEnrollments.map((student) => (
                  <li key={student.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.course}</p>
                    </div>
                    <p className="text-sm">{student.enrollmentDate}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )}

