import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, BookOpen, Star, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  duration: string;
  modules: number;
  students: number;
  rating: number;
  category: string;
  level: string;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Marketing Digital Completo',
    description: 'Domine todas as estratégias de marketing digital: SEO, Ads, Social Media e muito mais.',
    instructor: 'Carlos Silva',
    price: 297,
    originalPrice: 497,
    duration: '48h',
    modules: 12,
    students: 3420,
    rating: 4.9,
    category: 'Marketing',
    level: 'Intermediário',
  },
  {
    id: '2',
    title: 'Desenvolvimento Web Full Stack',
    description: 'Aprenda a criar aplicações web completas com React, Node.js e banco de dados.',
    instructor: 'Ana Santos',
    price: 397,
    originalPrice: 597,
    duration: '64h',
    modules: 16,
    students: 2180,
    rating: 4.8,
    category: 'Tecnologia',
    level: 'Avançado',
  },
  {
    id: '3',
    title: 'Design UX/UI Profissional',
    description: 'Crie interfaces incríveis e experiências de usuário memoráveis.',
    instructor: 'Pedro Costa',
    price: 247,
    originalPrice: 397,
    duration: '36h',
    modules: 10,
    students: 1850,
    rating: 4.9,
    category: 'Design',
    level: 'Iniciante',
  },
  {
    id: '4',
    title: 'Gestão de Projetos com Scrum',
    description: 'Aprenda metodologias ágeis e domine o Scrum para gerenciar projetos com eficiência.',
    instructor: 'Mariana Lima',
    price: 197,
    originalPrice: 297,
    duration: '24h',
    modules: 8,
    students: 1200,
    rating: 4.7,
    category: 'Negócios',
    level: 'Iniciante',
  },
  {
    id: '5',
    title: 'Python para Data Science',
    description: 'Do básico ao avançado em análise de dados com Python, Pandas e Machine Learning.',
    instructor: 'Roberto Dias',
    price: 347,
    originalPrice: 497,
    duration: '52h',
    modules: 14,
    students: 2890,
    rating: 4.9,
    category: 'Tecnologia',
    level: 'Intermediário',
  },
  {
    id: '6',
    title: 'Copywriting Persuasivo',
    description: 'Domine a arte de escrever textos que vendem e convertem.',
    instructor: 'Fernanda Alves',
    price: 197,
    originalPrice: 297,
    duration: '20h',
    modules: 6,
    students: 980,
    rating: 4.8,
    category: 'Marketing',
    level: 'Iniciante',
  },
];

const categories = ['Todos', 'Marketing', 'Tecnologia', 'Design', 'Negócios'];
const levels = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'Todos' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-tight">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Explore nossos{' '}
              <span className="text-gradient">cursos</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Encontre o curso perfeito para impulsionar sua carreira
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                {(selectedCategory !== 'Todos' || selectedLevel !== 'Todos') && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {[selectedCategory !== 'Todos', selectedLevel !== 'Todos'].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-xl bg-card border border-border/50 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filtros</h3>
                  <button
                    onClick={() => {
                      setSelectedCategory('Todos');
                      setSelectedLevel('Todos');
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Limpar filtros
                  </button>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Categoria</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Nível</p>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedLevel === level
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
          </p>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-2xl bg-card border border-border/50 overflow-hidden card-hover"
              >
                {/* Image */}
                <div className="relative aspect-video bg-lobo-navy-light overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-lobo-slate/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-foreground" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium">
                      {course.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/80 text-primary-foreground text-xs font-medium">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.modules} módulos
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students.toLocaleString()}
                    </div>
                  </div>

                  {/* Rating & Instructor */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span className="font-semibold text-sm">{course.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">por {course.instructor}</span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      {course.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {course.originalPrice}
                        </span>
                      )}
                      <p className="font-heading font-bold text-2xl text-primary">
                        R$ {course.price}
                      </p>
                    </div>
                    <Link to={`/curso/${course.id}`}>
                      <Button variant="hero" size="sm">
                        Ver Curso
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                Nenhum curso encontrado com os filtros selecionados.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Todos');
                  setSelectedLevel('Todos');
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CoursesPage;
