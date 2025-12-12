import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import funcUrls from "../../backend/func2url.json";

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  operation_type: string;
  property_type: string;
  area: number;
  location: string;
  description: string;
  estimated_value: number;
  status: string;
  created_at: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusColors: Record<string, string> = {
    new: "bg-blue-500",
    in_progress: "bg-yellow-500",
    completed: "bg-green-500",
    rejected: "bg-red-500"
  };

  const statusLabels: Record<string, string> = {
    new: "Новая",
    in_progress: "В работе",
    completed: "Завершена",
    rejected: "Отклонена"
  };

  const operationTypeLabels: Record<string, string> = {
    rent: "Аренда",
    buy: "Покупка"
  };

  const propertyTypeLabels: Record<string, string> = {
    apartment: "Квартира",
    house: "Дом",
    commercial: "Коммерческая",
    land: "Земля"
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(funcUrls.applications);
      const data = await response.json();
      
      if (response.ok) {
        setApplications(data.applications);
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить заявки",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заявки",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      const response = await fetch(funcUrls["update-status"], {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id: applicationId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Статус обновлен",
          description: "Изменения сохранены",
        });
        
        setApplications(prev =>
          prev.map(app =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось обновить статус",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive",
      });
    }
  };

  const totalApplications = applications.length;
  const newApplications = applications.filter(a => a.status === "new").length;
  const totalValue = applications.reduce((sum, a) => sum + a.estimated_value, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Building2" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold text-primary">Estate Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Администратор</span>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Icon name="LogOut" className="mr-2" size={16} />
                Выйти
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Панель администратора</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего заявок
              </CardTitle>
              <Icon name="FileText" className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalApplications}</div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Новые заявки
              </CardTitle>
              <Icon name="Bell" className="text-accent" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{newApplications}</div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Общая сумма
              </CardTitle>
              <Icon name="TrendingUp" className="text-green-600" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(totalValue / 1000000).toFixed(1)}М ₽
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Список заявок</CardTitle>
            <CardDescription>Все поступившие заявки на недвижимость</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <Icon name="Loader2" className="mx-auto animate-spin text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">Загрузка заявок...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="FileText" className="mx-auto text-muted-foreground mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">Заявок пока нет</h3>
                <p className="text-muted-foreground">Новые заявки появятся здесь</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Контакт</TableHead>
                      <TableHead>Операция</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Площадь</TableHead>
                      <TableHead>Местоположение</TableHead>
                      <TableHead>Оценка</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Дата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{app.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{app.email}</div>
                          <div className="text-sm text-muted-foreground">{app.phone}</div>
                        </TableCell>
                        <TableCell>{operationTypeLabels[app.operation_type]}</TableCell>
                        <TableCell>{propertyTypeLabels[app.property_type]}</TableCell>
                        <TableCell>{app.area} м²</TableCell>
                        <TableCell className="max-w-[200px] truncate">{app.location}</TableCell>
                        <TableCell className="font-semibold">
                          {app.estimated_value.toLocaleString('ru-RU')} ₽
                        </TableCell>
                        <TableCell>
                          <Select
                            value={app.status}
                            onValueChange={(value) => handleStatusChange(app.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue>
                                <Badge className={statusColors[app.status]}>
                                  {statusLabels[app.status]}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                  Новая
                                </div>
                              </SelectItem>
                              <SelectItem value="in_progress">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                  В работе
                                </div>
                              </SelectItem>
                              <SelectItem value="completed">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  Завершена
                                </div>
                              </SelectItem>
                              <SelectItem value="cancelled">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                                  Отменена
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString('ru-RU')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;