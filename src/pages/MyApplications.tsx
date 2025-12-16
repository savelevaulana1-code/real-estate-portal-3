import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Link, useNavigate } from "react-router-dom";
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

const MyApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

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

  const statusDescriptions: Record<string, string> = {
    new: "Ваша заявка принята и ожидает обработки",
    in_progress: "Наш менеджер работает над вашей заявкой",
    completed: "Заявка успешно обработана",
    rejected: "К сожалению, заявка была отклонена"
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
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userStr);
    setCurrentUser(user);
    fetchApplications(user.email);
  }, [navigate]);

  const fetchApplications = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${funcUrls["applications-update"]}?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (response.ok) {
        setApplications(data.applications || []);
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Icon name="Building2" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold text-primary">Недвижимость.Realty</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {currentUser?.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" className="mr-2" size={16} />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Мои заявки</h2>
            <p className="text-muted-foreground">Отслеживайте статус ваших заявок на недвижимость</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Icon name="Loader2" className="mx-auto animate-spin text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">Загрузка заявок...</p>
            </div>
          ) : applications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Icon name="FileText" className="mx-auto text-muted-foreground mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">У вас пока нет заявок</h3>
                <p className="text-muted-foreground mb-6">Создайте первую заявку, чтобы начать работу</p>
                <Link to="/applications">
                  <Button>
                    <Icon name="Plus" className="mr-2" size={18} />
                    Создать заявку
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="hover-scale">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {propertyTypeLabels[app.property_type]} - {operationTypeLabels[app.operation_type]}
                          </CardTitle>
                          <Badge className={statusColors[app.status]}>
                            {statusLabels[app.status]}
                          </Badge>
                        </div>
                        <CardDescription>
                          Заявка #{app.id} • {new Date(app.created_at).toLocaleDateString('ru-RU')}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {app.estimated_value.toLocaleString('ru-RU')} ₽
                        </div>
                        {app.operation_type === 'rent' && (
                          <span className="text-sm text-muted-foreground">/мес</span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <Icon name="MapPin" className="text-muted-foreground mt-0.5" size={18} />
                        <div>
                          <p className="text-sm font-medium">Местоположение</p>
                          <p className="text-sm text-muted-foreground">{app.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icon name="Ruler" className="text-muted-foreground mt-0.5" size={18} />
                        <div>
                          <p className="text-sm font-medium">Площадь</p>
                          <p className="text-sm text-muted-foreground">{app.area} м²</p>
                        </div>
                      </div>
                    </div>

                    {app.description && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Описание</p>
                        <p className="text-sm text-muted-foreground">{app.description}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Icon 
                        name={
                          app.status === 'new' ? 'Clock' :
                          app.status === 'in_progress' ? 'Timer' :
                          app.status === 'completed' ? 'CheckCircle2' :
                          'XCircle'
                        } 
                        className="text-muted-foreground" 
                        size={20} 
                      />
                      <p className="text-sm">{statusDescriptions[app.status]}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/applications">
              <Button variant="outline">
                <Icon name="Plus" className="mr-2" size={18} />
                Создать новую заявку
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;