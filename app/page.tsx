"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Users, Calendar, Star, Heart, Globe, Sparkles, Play, User, LogIn, Moon, Sun, Menu, X, Filter, ChevronRight, Gem, Scroll, Mountain, Bot as Lotus, Crown, Shield, Flame, Eye, Zap, Waves } from 'lucide-react';
import { useTheme } from "next-themes";
import { supabase } from '@/lib/supabase';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { UserNav } from '@/components/user-nav';
import { DeityModal } from '@/components/deity-modal';
import { StoryModal } from '@/components/story-modal';
import { TeachingModal } from '@/components/teaching-modal';
import { HistoryModal } from '@/components/history-modal';
import { FestivalSection } from '@/components/festival-section';
import { NavagrahaSection } from '@/components/navagraha-section';
import { 
  deities, 
  sacredStories, 
  teachings, 
  histories, 
  bhaktiVideos, 
  holyBooks,
  festivals,
  navagrahas
} from '@/lib/content';
import Image from 'next/image';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedDeity, setSelectedDeity] = useState<any>(null);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [selectedTeaching, setSelectedTeaching] = useState<any>(null);
  const [selectedHistory, setSelectedHistory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReligion, setSelectedReligion] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Only proceed if supabase client is available
    if (!supabase) {
      console.warn('Supabase client not available. Please configure environment variables.');
      return;
    }

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const religions = ['All', 'Hinduism', 'Christianity', 'Islam', 'Buddhism', 'Judaism', 'Sikhism', 'Universal'];

  const filteredDeities = deities.filter(deity => {
    const matchesSearch = deity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReligion = selectedReligion === 'All' || deity.religion === selectedReligion;
    return matchesSearch && matchesReligion;
  });

  const filteredStories = sacredStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReligion = selectedReligion === 'All' || story.religion === selectedReligion;
    return matchesSearch && matchesReligion;
  });

  const filteredTeachings = teachings.filter(teaching => {
    const matchesSearch = teaching.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teaching.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReligion = selectedReligion === 'All' || 
                           teaching.religions.includes(selectedReligion as any);
    return matchesSearch && matchesReligion;
  });

  const filteredVideos = bhaktiVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReligion = selectedReligion === 'All' || video.religion === selectedReligion;
    return matchesSearch && matchesReligion;
  });

  const filteredBooks = holyBooks.filter(book => {
    const matchesSearch = book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReligion = selectedReligion === 'All' || book.religion === selectedReligion;
    return matchesSearch && matchesReligion;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-border/50">
        <div className="nav-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Lotus className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Divinora
                </h1>
                <p className="text-xs text-muted-foreground">Universal Spiritual Wisdom</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
                
                {user ? (
                  <UserNav user={user} />
                ) : (
                  <Button 
                    onClick={() => setShowAuthDialog(true)}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Join Sacred Journey
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/50 py-4">
              <div className="flex flex-col space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="justify-start"
                >
                  <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 ml-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  Toggle Theme
                </Button>
                
                {user ? (
                  <div className="px-3">
                    <UserNav user={user} />
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      setShowAuthDialog(true);
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Join Sacred Journey
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="nav-container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6 animate-pulse-glow">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Universal Spiritual Wisdom Platform</span>
              <Heart className="h-4 w-4 text-pink-500 animate-pulse" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              Discover Divine Wisdom
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore sacred teachings, divine stories, and spiritual practices from Hindu traditions and world religions. 
              Begin your journey of enlightenment and inner peace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-6 text-lg"
                onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Lotus className="h-5 w-5 mr-2" />
                Begin Sacred Journey
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary/50 hover:border-primary hover:bg-primary/10 px-8 py-6 text-lg"
                onClick={() => document.getElementById('teachings')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Explore Teachings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="explore" className="py-12 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="nav-container">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deities, stories, teachings, or sacred texts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/50 rounded-xl"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedReligion}
                  onChange={(e) => setSelectedReligion(e.target.value)}
                  className="h-12 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/50 rounded-xl text-sm"
                >
                  {religions.map(religion => (
                    <option key={religion} value={religion}>{religion}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16">
        <div className="nav-container">
          <Tabs defaultValue="deities" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl">
              <TabsTrigger value="deities" className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Deities</span>
              </TabsTrigger>
              <TabsTrigger value="stories" className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                <Scroll className="h-4 w-4" />
                <span className="hidden sm:inline">Stories</span>
              </TabsTrigger>
              <TabsTrigger value="teachings" className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Teachings</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Videos</span>
              </TabsTrigger>
              <TabsTrigger value="books" className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Books</span>
              </TabsTrigger>
              <TabsTrigger value="festivals" className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Festivals</span>
              </TabsTrigger>
            </TabsList>

            {/* Deities Tab */}
            <TabsContent value="deities" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Divine Deities & Sacred Figures
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover the divine forms, sacred stories, and spiritual significance of deities from various religious traditions
                </p>
              </div>
              
              <div className="content-grid">
                {filteredDeities.map((deity) => (
                  <Card 
                    key={deity.id} 
                    className="group card-hover cursor-pointer overflow-hidden bg-gradient-to-br from-card to-card/50"
                    onClick={() => setSelectedDeity(deity)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center`}
                        alt={deity.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-white/90 text-primary">
                        {deity.religion}
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                        <Crown className="h-5 w-5 text-primary" />
                        {deity.name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{deity.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {deity.attributes.slice(0, 3).map((attr, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {attr}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Stories Tab */}
            <TabsContent value="stories" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Sacred Stories & Legends
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Immerse yourself in timeless stories that carry profound spiritual wisdom and universal truths
                </p>
              </div>
              
              <div className="content-grid">
                {filteredStories.map((story) => (
                  <Card 
                    key={story.id} 
                    className="group card-hover cursor-pointer overflow-hidden bg-gradient-to-br from-card to-card/50"
                    onClick={() => setSelectedStory(story)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center`}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-white/90 text-primary">
                        {story.religion}
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                        <Scroll className="h-5 w-5 text-primary" />
                        {story.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{story.tradition}</span>
                        <span>•</span>
                        <span>{story.era}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{story.description}</p>
                      
                      <div className="bg-primary/5 p-3 rounded-lg mb-4">
                        <p className="text-sm font-medium text-primary mb-1">Universal Theme</p>
                        <p className="text-sm text-muted-foreground italic">"{story.universalTheme}"</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>Read Story</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Teachings Tab */}
            <TabsContent value="teachings" id="teachings" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Universal Spiritual Teachings
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore profound spiritual teachings that transcend religious boundaries and guide us toward universal truth
                </p>
              </div>
              
              <div className="content-grid">
                {filteredTeachings.map((teaching) => (
                  <Card 
                    key={teaching.id} 
                    className="group card-hover cursor-pointer overflow-hidden bg-gradient-to-br from-card to-card/50"
                    onClick={() => setSelectedTeaching(teaching)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&center`}
                        alt={teaching.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4 flex flex-wrap gap-1">
                        {teaching.religions.slice(0, 2).map((religion, index) => (
                          <Badge key={index} className="bg-white/90 text-primary text-xs">
                            {religion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {teaching.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{teaching.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2 text-sm">Key Principles</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {teaching.keyPoints.slice(0, 2).map((point, index) => (
                              <li key={index} className="line-clamp-1">{point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>Explore Teaching</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Devotional Videos & Chants
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Experience the divine through sacred music, chants, and devotional videos from various traditions
                </p>
              </div>
              
              <div className="content-grid">
                {filteredVideos.map((video) => (
                  <Card key={video.id} className="group card-hover overflow-hidden bg-gradient-to-br from-card to-card/50">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Play className="h-8 w-8 text-primary ml-1" />
                        </div>
                      </div>
                      <Badge className="absolute top-4 right-4 bg-white/90 text-primary">
                        {video.religion}
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {video.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{video.channel}</span>
                        <span>•</span>
                        <span>{video.category}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{video.description}</p>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank')}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Books Tab */}
            <TabsContent value="books" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Sacred Texts & Holy Books
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover the foundational texts and scriptures that have guided humanity's spiritual journey for millennia
                </p>
              </div>
              
              <div className="content-grid">
                {filteredBooks.map((book) => (
                  <Card key={book.id} className="group card-hover overflow-hidden bg-gradient-to-br from-card to-card/50">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center`}
                        alt={book.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-white/90 text-primary">
                        {book.religion}
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {book.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{book.category}</span>
                        <span>•</span>
                        <span>{book.language}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{book.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-primary/5 p-3 rounded-lg text-center">
                          <p className="text-sm font-medium text-primary">Verses</p>
                          <p className="text-lg font-bold">{book.verses}</p>
                        </div>
                        <div className="bg-secondary/5 p-3 rounded-lg text-center">
                          <p className="text-sm font-medium text-secondary">Chapters</p>
                          <p className="text-lg font-bold">{book.chapters}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>Learn More</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Festivals Tab */}
            <TabsContent value="festivals" className="space-y-8">
              <FestivalSection />
            </TabsContent>
          </Tabs>

          {/* Additional Sections */}
          <div className="space-y-16 mt-16">
            {/* Navagrahas Section */}
            <NavagrahaSection />

            {/* Statistics Section */}
            <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Our Sacred Collection
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover the vast repository of spiritual wisdom we've curated for your journey
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{deities.length}+</div>
                  <div className="text-sm text-muted-foreground">Divine Deities</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Scroll className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-secondary mb-2">{sacredStories.length}+</div>
                  <div className="text-sm text-muted-foreground">Sacred Stories</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-2">{teachings.length}+</div>
                  <div className="text-sm text-muted-foreground">Universal Teachings</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-amber-600 mb-2">{festivals.length}+</div>
                  <div className="text-sm text-muted-foreground">Sacred Festivals</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="nav-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Lotus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Divinora</h3>
                  <p className="text-sm text-slate-400">Universal Spiritual Wisdom</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Discover divine wisdom, sacred teachings, and spiritual practices from Hindu traditions and world religions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Deities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sacred Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Teachings</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Festivals</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Holy Books</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Devotional Videos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Meditation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prayer</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 Divinora. Made with ❤️ for spiritual seekers worldwide.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => setShowAuthDialog(false)}
      />
      
      <DeityModal
        deity={selectedDeity}
        isOpen={!!selectedDeity}
        onClose={() => setSelectedDeity(null)}
      />
      
      <StoryModal
        story={selectedStory}
        isOpen={!!selectedStory}
        onClose={() => setSelectedStory(null)}
      />
      
      <TeachingModal
        teaching={selectedTeaching}
        isOpen={!!selectedTeaching}
        onClose={() => setSelectedTeaching(null)}
      />
      
      <HistoryModal
        history={selectedHistory}
        isOpen={!!selectedHistory}
        onClose={() => setSelectedHistory(null)}
      />
    </div>
  );
}