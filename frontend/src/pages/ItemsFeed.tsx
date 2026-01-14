import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { ItemCard } from '@/components/common/ItemCard';
import { CategoryPill } from '@/components/common/CategoryPill';
import { Input } from '@/components/ui/input';
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { where } from "firebase/firestore";

type FilterType = 'all' | 'lost' | 'found' | 'my-posts';

export default function ItemsFeed() {
  const [items, setItems] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("item");
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Items' },
    { key: 'lost', label: 'Lost' },
    { key: 'found', label: 'Found' },
    { key: 'my-posts', label: 'My Posts' },
  ];

  // Load items from Firestore
  useEffect(() => {
    const q = query(collection(db, "items"), where("status", "!=", "resolved"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Filter + search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'lost' && item.type === 'lost') ||
        (activeFilter === 'found' && item.type === 'found') ||
        (activeFilter === 'my-posts' && item.postedBy === auth.currentUser?.uid);

      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, activeFilter]);

  return (
    <>
      <PageContainer>
        {/* Header */}
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold text-foreground">Browse Items</h1>
          <p className="text-muted-foreground mt-1">
            {filteredItems.length} items found
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative animate-fade-up" style={{ animationDelay: "50ms" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-10 h-12 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div
          className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-2 animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          {filters.map((filter) => (
            <CategoryPill
              key={filter.key}
              label={filter.label}
              isActive={activeFilter === filter.key}
              onClick={() => setActiveFilter(filter.key)}
            />
          ))}
        </div>

        {/* Items Grid */}
        <div
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-up"
          style={{ animationDelay: "150ms" }}
        >
          {filteredItems.map((item) => (
            <Link key={item.id} to={`/item/${item.id}`}>
              <div id={`item-${item.id}`}>
                <ItemCard item={item} />
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">No items found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </PageContainer>
      <BottomNav />
    </>
  );
}
