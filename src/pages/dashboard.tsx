import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, Clock, Award, Calendar, AlertCircle } from 'lucide-react';

interface DashboardStats {
  weeklyHours: number;
  assignments: number;
  clinicalHours: number;
  averageGrade: number;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', 1], // Hard-coded user ID for demo
    queryFn: async () => {
      const response = await fetch('/api/dashboard-stats/1');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  const { data: upcomingAssignments } = useQuery({
    queryKey: ['assignments', 'upcoming'],
    queryFn: async () => {
      const response = await fetch('/api/assignments?userId=1&upcoming=true');
      if (!response.ok) throw new Error('Failed to fetch assignments');
      return response.json();
    },
  });

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses?userId=1');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await fetch('/api/goals?userId=1');
      if (!response.ok) throw new Error('Failed to fetch goals');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your nursing school overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Study Hours</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.weeklyHours || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.assignments || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clinical Hours</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.clinicalHours || 0}</p>
              </div>
              <Target className="h-8 w-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Grade</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.averageGrade || 0}%</p>
              </div>
              <Award className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Upcoming Assignments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAssignments?.slice(0, 5).map((assignment: any) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                    assignment.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {assignment.priority}
                  </span>
                </div>
              ))}
              {(!upcomingAssignments || upcomingAssignments.length === 0) && (
                <p className="text-gray-500 text-center py-4">No upcoming assignments</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-emerald-500" />
              <span>Active Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals?.filter((goal: any) => goal.status === 'active').slice(0, 3).map((goal: any) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <span className="text-sm text-gray-600">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {(!goals || goals.filter((goal: any) => goal.status === 'active').length === 0) && (
                <p className="text-gray-500 text-center py-4">No active goals</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <span>Current Courses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses?.map((course: any) => (
              <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: course.color }}
                  ></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{course.name}</h4>
                    <p className="text-sm text-gray-600">{course.code}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{course.professor}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    parseFloat(course.currentGrade || '0') >= 90 ? 'grade-a' :
                    parseFloat(course.currentGrade || '0') >= 80 ? 'grade-b' :
                    parseFloat(course.currentGrade || '0') >= 70 ? 'grade-c' :
                    'grade-d'
                  }`}>
                    {course.currentGrade || 'N/A'}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ); 
