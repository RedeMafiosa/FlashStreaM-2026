const db = globalThis.__B44_DB__ || {
  auth: {
    isAuthenticated: async () => false,
    me: async () => null,
    loginViaEmailPassword: async () => {
      throw new Error("DB não inicializada");
    },
    loginWithProvider: async () => {
      throw new Error("DB não inicializada");
    }
  },

  entities: new Proxy({}, {
    get: (_, entityName) => ({
      list: async () => {
        console.warn(`DB não inicializada: ${entityName}.list()`);
        return [];
      },
      filter: async () => {
        console.warn(`DB não inicializada: ${entityName}.filter()`);
        return [];
      },
      get: async () => {
        console.warn(`DB não inicializada: ${entityName}.get()`);
        return null;
      },
      create: async () => {
        console.warn(`DB não inicializada: ${entityName}.create()`);
        return null;
      },
      update: async () => {
        console.warn(`DB não inicializada: ${entityName}.update()`);
        return null;
      },
      delete: async () => {
        console.warn(`DB não inicializada: ${entityName}.delete()`);
        return null;
      }
    })
  }),

  integrations: {
    Core: {
      UploadFile: async () => {
        console.warn("DB não inicializada: UploadFile()");
        return { file_url: "" };
      }
    }
  }
};

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ArrowRight,
  TrendingUp,
  Gamepad2,
  Music,
  Palette,
  Mic,
  Trophy,
  GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import StreamCard from "@/components/stream/StreamCard";

const categories = [
  { icon: Gamepad2, label: "Gaming", key: "gaming", color: "from-red-500 to-orange-500" },
  { icon: Mic, label: "IRL", key: "irl", color: "from-blue-500 to-cyan-500" },
  { icon: Music, label: "Música", key: "music", color: "from-green-500 to-emerald-500" },
  { icon: Palette, label: "Criativo", key: "creative", color: "from-purple-500 to-pink-500" },
  { icon: Trophy, label: "Esports", key: "esports", color: "from-yellow-500 to-amber-500" },
  { icon: GraduationCap, label: "Educação", key: "education", color: "from-indigo-500 to-blue-500" }
];

export default function Home() {

  useEffect(() => {
    const test = async () => {
      const res = await db.entities.Stream.list();
      console.log("STREAMS:", res);
    };

    test();
  }, []);
  
  const { data: streams = [], isLoading } = useQuery({
    queryKey: ["streams"],
    queryFn: async () => {
      const res = await db.entities.Stream.list();

      // garante que viewers funciona mesmo sendo TEXT
      return res.map((s) => ({
        ...s,
        viewers: Number(s.viewers || 0)
      }));
    }
  });

  const liveStreams = streams.filter((s) => s.status === "live");

  const featuredStream = liveStreams[0] || streams[0];

  return (
    <div className="p-4 md:p-6 space-y-8">

      {/* HERO */}
      {featuredStream && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/20 via-card to-card border border-border"
        >
          <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8 rounded">

            <div className="flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-purple">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="font-display font-bold text-2xl tracking-wide">
                  Flash<span className="text-primary">Stream</span>
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight">
                A tua plataforma de <span className="text-primary">livestream</span>
              </h1>

              <p className="text-muted-foreground max-w-md">
                Descobre streams incríveis e interage com criadores.
              </p>

              <div className="flex gap-3">
                <Link to="/streams">
                  <Button className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Ver Streams
                  </Button>
                </Link>

                <Link to="/store">
                  <Button variant="outline" className="gap-2">
                    Loja <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <Link
              to={`/stream/${featuredStream.id}`}
              className="relative aspect-video rounded-xl overflow-hidden group"
            >
              <img
                src={
                  featuredStream.thumbnail_url ||
                  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"
                }
                alt={featuredStream.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {featuredStream.status === "live" && (
                <Badge className="absolute top-3 left-3 bg-red-600 text-white">
                  🔴 AO VIVO
                </Badge>
              )}

              <div className="absolute bottom-3 left-3">
                <p className="text-white font-semibold text-sm">
                  {featuredStream.title}
                </p>
              </div>
            </Link>
          </div>
        </motion.section>
      )}

      {/* CATEGORIAS */}
      <section>
        <h2 className="text-lg font-bold mb-4">Categorias</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={`/streams?cat=${cat.key}`}
              className="p-4 rounded-xl bg-card border hover:border-primary/40 text-center"
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${cat.color}`} />
              <p className="text-sm">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* AO VIVO */}
      {liveStreams.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4">🔴 Ao Vivo</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveStreams.slice(0, 8).map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </section>
      )}

      {/* RECOMENDADOS */}
      <section>
        <h2 className="text-lg font-bold mb-4">Recomendados</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {streams.slice(0, 8).map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </section>

      {/* LOADING */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* EMPTY */}
      {!isLoading && streams.length === 0 && (
        <div className="text-center py-20">
          <Zap className="w-16 h-16 mx-auto text-primary/30 mb-4" />
          <h2 className="text-xl font-bold">Sem streams ainda</h2>
          <p className="text-muted-foreground">Cria a primeira stream!</p>
        </div>
      )}

    </div>
  );
}
