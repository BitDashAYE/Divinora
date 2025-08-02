"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Heart, Star, Globe, BookOpen, Play, Users, Sparkles, Bot as Lotus, Sun, Moon, Wind, Waves, Mountain, Leaf, Flame, Eye, Compass, Shield, Crown, Feather, Zap, Music, Camera, Headphones, Mic, Volume2, Calendar, Clock, MapPin, Filter, ArrowRight, ChevronDown, Menu, X, User, Settings, LogIn, UserPlus } from "lucide-react";
import { deities, festivals, sacredStories, teachings, histories, bhaktiVideos, holyBooks } from "@/lib/content";
import { DeityModal } from "@/components/deity-modal";
import { StoryModal } from "@/components/story-modal";
import { TeachingModal } from "@/components/teaching-modal";
import { HistoryModal } from "@/components/history-modal";
import { FestivalSection } from "@/components/festival-section";
import { NavagrahaSection } from "@/components/navagraha-section";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { UserNav } from "@/components/user-nav";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

export default function Home() {
  const [selectedDeity, setSelectedDeity] = useState<any>(null);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [selectedTeaching, setSelectedTeaching] = useState<any>(null);
  const [selectedHistory, setSelectedHistory] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReligion, setSelectedReligion] = useState("All");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [healingQuote, setHealingQuote] = useState("");
  const { toast } = useToast();

  const healingQuotes = [
    "Peace comes from within. Do not seek it without. - Buddha",
    "The soul that sees beauty may sometimes walk alone. - Goethe", 
    "In the depth of winter, I finally learned that there was in me an invincible summer. - Albert Camus",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
    "The wound is the place where the Light enters you. - Rumi",
    "Be yourself; everyone else is already taken. - Oscar Wilde",
    "The only way out is through. - Robert Frost"
  ];

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Change healing quote every 10 seconds
    const quoteInterval = setInterval(() => {
      setHealingQuote(healingQuotes[Math.floor(Math.random() * healingQuotes.length)]);
    }, 10000);

    // Set initial quote
    setHealingQuote(healingQuotes[0]);

    return () => {
      subscription.unsubscribe();
      clearInterval(timeInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  const religions = ["All", "Hinduism", "Christianity", "Islam", "Buddhism", "Judaism", "Sikhism", "Universal"];

  const filteredDeities = deities.filter(deity => 
    (selectedReligion === "All" || deity.religion === selectedReligion) &&
    deity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStories = sacredStories.filter(story => 
    (selectedReligion === "All" || story.religion === selectedReligion) &&
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachings = teachings.filter(teaching => 
    (selectedReligion === "All" || teaching.religions.includes(selectedReligion as any)) &&
    teaching.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    toast({
      title: "Welcome to Divinora! 🙏",
      description: "Your spiritual journey begins here.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      {/* Revolutionary Floating Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-white/20 dark:border-slate-700/20">
        <div className="flex items-center space-x-6">
          {/* Logo with Spiritual Symbol */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Lotus className="h-8 w-8 text-gradient-to-r from-purple-600 to-pink-600 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-30 animate-pulse" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Divinora
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30">
              <BookOpen className="h-4 w-4 mr-2" />
              Sacred Texts
            </Button>
            <Button variant="ghost" className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30">
              <Users className="h-4 w-4 mr-2" />
              Community
            </Button>
            <Button variant="ghost" className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30">
              <Heart className="h-4 w-4 mr-2" />
              Meditation
            </Button>
          </div>

          {/* Time & Spiritual Status */}
          <div className="hidden lg:flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Sun className="h-4 w-4 text-amber-500" />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-2">
            {user ? (
              <UserNav user={user} />
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAuthOpen(true)}
                  className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsAuthOpen(true)}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Join
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden">
          <div className="fixed top-20 left-4 right-4 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl">
            <div className="space-y-4">
              <Button variant="ghost" className="w-full justify-start rounded-xl">
                <BookOpen className="h-4 w-4 mr-2" />
                Sacred Texts
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-xl">
                <Users className="h-4 w-4 mr-2" />
                Community
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-xl">
                <Heart className="h-4 w-4 mr-2" />
                Meditation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revolutionary Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Spiritual Symbols */}
          <div className="absolute top-20 left-10 animate-float opacity-20">
            <Lotus className="h-16 w-16 text-purple-400" />
          </div>
          <div className="absolute top-40 right-20 animate-float-slow opacity-20" style={{ animationDelay: '2s' }}>
            <Star className="h-12 w-12 text-amber-400" />
          </div>
          <div className="absolute bottom-40 left-20 animate-float opacity-20" style={{ animationDelay: '4s' }}>
            <Sun className="h-20 w-20 text-orange-400" />
          </div>
          <div className="absolute bottom-20 right-10 animate-float-slow opacity-20" style={{ animationDelay: '6s' }}>
            <Moon className="h-14 w-14 text-blue-400" />
          </div>
          
          {/* Healing Energy Waves */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          {/* Main Healing Message */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-6 py-3 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Your Digital Sanctuary for Spiritual Healing
              </span>
              <Sparkles className="h-5 w-5 text-pink-600 animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent animate-gradient">
                Find Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent animate-gradient" style={{ animationDelay: '1s' }}>
                Inner Peace
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              Discover divine wisdom from all world religions. Experience healing through sacred teachings, 
              meditation practices, and universal spiritual guidance that transcends all boundaries.
            </p>
          </div>

          {/* Healing Quote Display */}
          <div className="mb-12 p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-red-500 animate-pulse mr-2" />
              <span className="text-sm font-medium text-muted-foreground">Healing Wisdom</span>
              <Heart className="h-6 w-6 text-red-500 animate-pulse ml-2" />
            </div>
            <p className="text-lg md:text-xl italic text-center text-muted-foreground transition-all duration-1000">
              "{healingQuote}"
            </p>
          </div>

          {/* Revolutionary Search Interface */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-30 animate-pulse" />
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-2 border border-white/20 dark:border-slate-700/20">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-muted-foreground ml-4" />
                  <Input
                    placeholder="Search for divine wisdom, sacred stories, or spiritual guidance..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 bg-transparent text-lg placeholder:text-muted-foreground/70 focus-visible:ring-0"
                  />
                  <Button className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Religion Filter Pills */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {religions.map((religion) => (
                <Button
                  key={religion}
                  variant={selectedReligion === religion ? "default" : "outline"}
                  onClick={() => setSelectedReligion(religion)}
                  className={`rounded-full px-6 py-2 transition-all duration-300 ${
                    selectedReligion === religion
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                      : "hover:bg-purple-50 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-700"
                  }`}
                >
                  {religion === "All" && <Globe className="h-4 w-4 mr-2" />}
                  {religion === "Hinduism" && <Lotus className="h-4 w-4 mr-2" />}
                  {religion === "Christianity" && <Crown className="h-4 w-4 mr-2" />}
                  {religion === "Islam" && <Star className="h-4 w-4 mr-2" />}
                  {religion === "Buddhism" && <Leaf className="h-4 w-4 mr-2" />}
                  {religion === "Judaism" && <Shield className="h-4 w-4 mr-2" />}
                  {religion === "Sikhism" && <Compass className="h-4 w-4 mr-2" />}
                  {religion === "Universal" && <Heart className="h-4 w-4 mr-2" />}
                  {religion}
                </Button>
              ))}
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button size="lg" className="rounded-2xl px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Play className="h-5 w-5 mr-2" />
              Start Your Healing Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl px-8 py-4 text-lg border-2 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Heart className="h-5 w-5 mr-2" />
              Explore Sacred Wisdom
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-muted-foreground" />
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 space-y-20 pb-20">
        {/* Sacred Figures Section */}
        <section className="px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 px-6 py-3 rounded-full mb-6">
              <Crown className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Divine Beings</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Sacred Figures & Divine Beings
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with divine beings from all spiritual traditions and find guidance for your healing journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDeities.slice(0, 8).map((deity) => (
              <Card 
                key={deity.id} 
                className="group cursor-pointer overflow-hidden border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl"
                onClick={() => setSelectedDeity(deity)}
              >
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20" />
                  <Image
                    src={`https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center`}
                    alt={deity.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/80 text-purple-700 border-0">
                      {deity.religion}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                    {deity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {deity.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {deity.attributes.slice(0, 3).map((attr, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {attr}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Sacred Stories Section */}
        <section className="px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-6 py-3 rounded-full mb-6">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Sacred Narratives</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Sacred Stories & Legends
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover timeless stories that have guided humanity toward wisdom and healing for millennia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.slice(0, 6).map((story) => (
              <Card 
                key={story.id} 
                className="group cursor-pointer overflow-hidden border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl"
                onClick={() => setSelectedStory(story)}
              >
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20" />
                  <Image
                    src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center`}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/80 text-blue-700 border-0">
                      {story.religion}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {story.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {story.tradition} • {story.era}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {story.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {story.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {story.universalTheme}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Universal Teachings Section */}
        <section className="px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 px-6 py-3 rounded-full mb-6">
              <Leaf className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Universal Wisdom</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Universal Spiritual Teachings
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore profound teachings that unite all spiritual traditions in their quest for healing and enlightenment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredTeachings.slice(0, 4).map((teaching) => (
              <Card 
                key={teaching.id} 
                className="group cursor-pointer overflow-hidden border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl"
                onClick={() => setSelectedTeaching(teaching)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-wrap gap-2">
                      {teaching.religions.slice(0, 3).map((religion, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {religion}
                        </Badge>
                      ))}
                    </div>
                    <Leaf className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                    {teaching.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {teaching.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Principles:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {teaching.keyPoints.slice(0, 3).map((point, index) => (
                        <li key={index} className="flex items-start">
                          <Star className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Festivals Section */}
        <section className="px-4 max-w-7xl mx-auto">
          <FestivalSection />
        </section>

        {/* Devotional Videos Section */}
        <section className="px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 px-6 py-3 rounded-full mb-6">
              <Play className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Healing Sounds</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Devotional Music & Chants
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the healing power of sacred music, chants, and prayers from all spiritual traditions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bhaktiVideos.slice(0, 6).map((video) => (
              <Card 
                key={video.id} 
                className="group cursor-pointer overflow-hidden border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl"
              >
                <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-br from-red-400/20 to-pink-400/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 dark:bg-slate-900/80 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/80 text-red-700 border-0">
                      {video.religion}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-2 text-white">
                      <Volume2 className="h-4 w-4" />
                      <span className="text-sm font-medium">{video.category}</span>
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
                    {video.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {video.channel}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {video.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Navagraha Section */}
        <section className="px-4 max-w-7xl mx-auto">
          <NavagrahaSection />
        </section>

        {/* Call to Action Section */}
        <section className="px-4 max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 p-12 text-center text-white">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Begin Your Healing Journey Today
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Join millions of seekers who have found peace, healing, and spiritual growth through Divinora. 
                Your transformation starts with a single step.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button size="lg" variant="secondary" className="rounded-2xl px-8 py-4 text-lg bg-white text-purple-600 hover:bg-gray-100 shadow-xl">
                  <Heart className="h-5 w-5 mr-2" />
                  Start Free Meditation
                </Button>
                <Button size="lg" variant="outline" className="rounded-2xl px-8 py-4 text-lg border-2 border-white text-white hover:bg-white/10 shadow-xl">
                  <Users className="h-5 w-5 mr-2" />
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
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
      <AuthDialog 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={handleAuthSuccess}
      />

      <Toaster />
    </div>
  );
}