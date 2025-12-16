import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Building2" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold text-primary">Недвижимость.Realty</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition">Главная</Link>
            <Link to="/catalog" className="text-foreground hover:text-primary transition">Каталог</Link>
            <Link to="/applications" className="text-foreground hover:text-primary transition">Оставить заявку</Link>
            <Link to="/contacts" className="text-foreground hover:text-primary transition">Контакты</Link>
          </nav>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline">Войти</Button>
            </Link>
            <Link to="/register">
              <Button>Регистрация</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 bg-gradient-to-br from-primary via-primary to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6 animate-fade-in">
            Профессиональная оценка недвижимости
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Система учета заявок на аренду и покупку недвижимости с автоматической оценкой стоимости
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/catalog">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Смотреть каталог
                <Icon name="Home" className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/applications">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white">
                Оставить заявку
                <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-12">Наши возможности</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover-scale">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Icon name="FileText" className="text-primary" size={24} />
              </div>
              <CardTitle>Подача заявок</CardTitle>
              <CardDescription>
                Быстрое оформление заявок на аренду и покупку недвижимости
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-scale">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Icon name="Calculator" className="text-accent" size={24} />
              </div>
              <CardTitle>Автоматическая оценка</CardTitle>
              <CardDescription>
                Моментальный расчет стоимости на основе параметров объекта
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-scale">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Icon name="LayoutDashboard" className="text-primary" size={24} />
              </div>
              <CardTitle>Панель управления</CardTitle>
              <CardDescription>
                Удобный интерфейс для администраторов с полной статистикой
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Почему выбирают нас?</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="text-accent mt-1" size={24} />
                  <div>
                    <h4 className="font-semibold mb-1">Профессиональный подход</h4>
                    <p className="text-muted-foreground">Работаем только с проверенными объектами</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="text-accent mt-1" size={24} />
                  <div>
                    <h4 className="font-semibold mb-1">Быстрая обработка</h4>
                    <p className="text-muted-foreground">Оценка и ответ в течение 24 часов</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="text-accent mt-1" size={24} />
                  <div>
                    <h4 className="font-semibold mb-1">Прозрачность сделок</h4>
                    <p className="text-muted-foreground">Полный контроль на каждом этапе</p>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Готовы начать?</CardTitle>
                <CardDescription>Заполните заявку прямо сейчас</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/applications">
                  <Button className="w-full" size="lg">
                    Оформить заявку
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-100">© 2025 Недвижимость.Realty. Все права защищены.</p>
            <Link to="/admin/login" className="text-blue-100 hover:text-white transition text-sm inline-flex items-center gap-1">
              <Icon name="Shield" size={16} />
              Вход для администраторов
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;