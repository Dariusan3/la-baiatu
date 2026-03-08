import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send, CalendarDays, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

export default function ContactSection({ info }) {
  const [date, setDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", time: "", guests: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !date || !formData.time || !formData.guests) {
      toast.error("Completați toate câmpurile obligatorii");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/reservations`, {
        ...formData,
        date: format(date, "yyyy-MM-dd"),
        guests: parseInt(formData.guests, 10),
      });
      toast.success("Rezervare trimisă cu succes! Vă vom contacta pentru confirmare.");
      setFormData({ name: "", email: "", phone: "", time: "", guests: "", notes: "" });
      setDate(null);
    } catch (err) {
      toast.error("Eroare la trimiterea rezervării. Încercați din nou.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="py-16 md:py-24 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-accent text-2xl text-primary mb-2">Veniți la noi</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Contact & Rezervări
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Contact Info + Map */}
          <div>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground">Adresă</h3>
                  <p className="text-muted-foreground text-sm">{info?.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground">Telefon</h3>
                  <a href={`tel:${info?.phone}`} className="text-primary hover:underline text-sm">
                    {info?.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground">Email</h3>
                  <a href={`mailto:${info?.email}`} className="text-primary hover:underline text-sm">
                    {info?.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground">Program</h3>
                  {info?.opening_hours && Object.entries(info.opening_hours).map(([day, hours]) => (
                    <p key={day} className="text-muted-foreground text-sm">{day}: {hours}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="rounded-xl overflow-hidden shadow-lg border border-border" data-testid="google-map">
              <iframe
                title="Locație La Băiatu'"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2765.0!2d22.9!3d45.88333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDUzJzAwLjAiTiAyMsKwNTQnMDAuMCJF!5e0!3m2!1sro!2sro!4v1700000000000"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Reservation Form */}
          <div>
            <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-md">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                Rezervă o Masă
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Completați formularul și vă vom contacta pentru confirmare
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" data-testid="reservation-form">
                <div>
                  <Label htmlFor="res-name" className="text-foreground font-medium text-sm">
                    Nume complet *
                  </Label>
                  <Input
                    id="res-name"
                    placeholder="Ion Popescu"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="mt-1.5 h-11 bg-background border-input rounded-lg"
                    data-testid="reservation-name-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="res-email" className="text-foreground font-medium text-sm">
                      Email
                    </Label>
                    <Input
                      id="res-email"
                      type="email"
                      placeholder="email@exemplu.ro"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="mt-1.5 h-11 bg-background border-input rounded-lg"
                      data-testid="reservation-email-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="res-phone" className="text-foreground font-medium text-sm">
                      Telefon *
                    </Label>
                    <Input
                      id="res-phone"
                      placeholder="+40 7XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="mt-1.5 h-11 bg-background border-input rounded-lg"
                      data-testid="reservation-phone-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground font-medium text-sm">Data *</Label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full mt-1.5 h-11 justify-start text-left font-normal bg-background border-input rounded-lg"
                          data-testid="reservation-date-picker"
                        >
                          <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                          {date ? format(date, "d MMMM yyyy", { locale: ro }) : "Alegeți data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => { setDate(d); setCalendarOpen(false); }}
                          disabled={(d) => d < new Date()}
                          data-testid="reservation-calendar"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-foreground font-medium text-sm">Ora *</Label>
                    <Select value={formData.time} onValueChange={(v) => handleChange("time", v)}>
                      <SelectTrigger className="mt-1.5 h-11 bg-background border-input rounded-lg" data-testid="reservation-time-select">
                        <SelectValue placeholder="Alegeți ora" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-foreground font-medium text-sm">Număr persoane *</Label>
                  <Select value={formData.guests} onValueChange={(v) => handleChange("guests", v)}>
                    <SelectTrigger className="mt-1.5 h-11 bg-background border-input rounded-lg" data-testid="reservation-guests-select">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Selectați" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "persoană" : "persoane"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="res-notes" className="text-foreground font-medium text-sm">
                    <MessageSquare className="inline w-4 h-4 mr-1 text-muted-foreground" />
                    Mențiuni speciale
                  </Label>
                  <Textarea
                    id="res-notes"
                    placeholder="Alergii, preferințe, ocazii speciale..."
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    className="mt-1.5 bg-background border-input rounded-lg resize-none"
                    rows={3}
                    data-testid="reservation-notes-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-primary text-white hover:bg-primary/90 h-12 text-base font-serif shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  data-testid="reservation-submit-btn"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Trimite Rezervarea
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
