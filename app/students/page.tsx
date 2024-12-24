"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [course, setCourse] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch('/api/students')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch students')
      }
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch students",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const addStudent = async () => {
    if (name && email && course) {
      try {
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, course }),
        })
        if (!response.ok) {
          throw new Error('Failed to add student')
        }
        const newStudent = await response.json()
        setStudents([...students, newStudent])
        resetForm()
        setIsDialogOpen(false)
        toast({
          title: "Student added",
          description: `${name} has been added to the system.`,
        })
      } catch (error) {
        console.error('Error adding student:', error)
        toast({
          title: "Error",
          description: "Failed to add student. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const updateStudent = async () => {
    if (editingId && name && email && course) {
      try {
        const response = await fetch(`/api/students/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, course }),
        })
        if (!response.ok) {
          throw new Error('Failed to update student')
        }
        const updatedStudent = await response.json()
        setStudents(students.map(student =>
          student.id === editingId ? updatedStudent : student
        ))
        resetForm()
        setIsDialogOpen(false)
        toast({
          title: "Student updated",
          description: `${name}'s information has been updated.`,
        })
      } catch (error) {
        console.error('Error updating student:', error)
        toast({
          title: "Error",
          description: "Failed to update student. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const deleteStudent = async (id: number) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete student')
      }
      setStudents(students.filter((student) => student.id !== id))
      toast({
        title: "Student deleted",
        description: "The student has been removed from the system.",
      })
    } catch (error) {
      console.error('Error deleting student:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student",
        variant: "destructive",
      })
    }
  }

  const editStudent = (student: Student) => {
    setEditingId(student.id)
    setName(student.name)
    setEmail(student.email)
    setCourse(student.course)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setCourse("")
    setEditingId(null)
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Students</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Student" : "Add New Student"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="course" className="text-right">
                  Course
                </Label>
                <Input
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={editingId ? updateStudent : addStudent}>
              {editingId ? "Update Student" : "Add Student"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm mr-2"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => editStudent(student)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => deleteStudent(student.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

