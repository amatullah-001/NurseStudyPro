import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Course {
  id: number;
  name: string;
  code: string;
  professor: string;
  credits: number;
  semester: string;
  currentGrade: string;
  color: string;
}

export default function Courses() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses?userId=1');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (courseData: Partial<Course>) => {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...courseData, userId: 1 }),
      });
      if (!response.ok) throw new Error('Failed to create course');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsDialogOpen(false);
      setEditingCourse(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...courseData }: Partial<Course> & { id: number }) => {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });
      if (!response.ok) throw new Error('Failed to update course');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsDialogOpen(false);
      setEditingCourse(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete course');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const courseData = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      professor: formData.get('professor') as string,
      credits: parseInt(formData.get('credits') as string),
      semester: formData.get('semester') as string,
      currentGrade: formData.get('currentGrade') as string,
      color: formData.get('color') as string,
    };

    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, ...courseData });
    } else {
      createMutation.mutate(courseData);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-2">Manage your current semester courses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingCourse?.name || ''}
                  placeholder="e.g., Anatomy & Physiology II"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={editingCourse?.code || ''}
                  placeholder="e.g., NURS 202"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professor">Professor</Label>
                <Input
                  id="professor"
                  name="professor"
                  defaultValue={editingCourse?.professor || ''}
                  placeholder="e.g., Dr. Smith"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    name="credits"
                    type="number"
                    defaultValue={editingCourse?.credits || ''}
                    placeholder="3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentGrade">Current Grade</Label>
                  <Input
                    id="currentGrade"
                    name="currentGrade"
                    defaultValue={editingCourse?.currentGrade || ''}
                    placeholder="85.5"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  name="semester"
                  defaultValue={editingCourse?.semester || ''}
                  placeholder="Spring 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  type="color"
                  defaultValue={editingCourse?.color || '#10b981'}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingCourse(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  {editingCourse ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingCourse(course);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(course.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Code:</span>
                  <span className="font-medium">{course.code}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Professor:</span>
                  <span className="font-medium">{course.professor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Credits:</span>
                  <span className="font-medium">{course.credits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Grade:</span>
                  <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                    parseFloat(course.currentGrade || '0') >= 90 ? 'grade-a' :
                    parseFloat(course.currentGrade || '0') >= 80 ? 'grade-b' :
                    parseFloat(course.currentGrade || '0') >= 70 ? 'grade-c' :
                    'grade-d'
                  }`}>
                    {course.currentGrade || 'N/A'}%
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-xs text-gray-500">{course.semester}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses && courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-4">Add your first course to get started</p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      )}
    </div>
  );
