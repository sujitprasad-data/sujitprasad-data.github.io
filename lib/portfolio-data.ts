export type CodeSnippet = { title: string; language: string; body: string };

export type Project = {
  slug: string;
  title: string;
  domain: string;
  metric: string;
  metricLabel: string;
  status?: string;
  technologies: string[];
  summary: string;
  challenge: string;
  approach: string;
  impact: string;
  decisions: string[];
  diagram: string;
  snippet?: CodeSnippet;
};

export const siteConfig = {
  name: "Sujit Prasad",
  role: "Lead Data Engineer",
  location: "Bengaluru, India",
  email: "sujitprasad21@gmail.com",
  linkedin: "https://www.linkedin.com/in/sujit-prasad-09835179",
  github: "https://github.com/sujitprasad-data",
  url: "https://sujitprasad-data.github.io",
};

export const heroMetrics = [
  { value: "$40K → <$100", label: "annual pipeline cost" },
  { value: "14h → 10 min", label: "legacy ETL runtime" },
  { value: "£100K", label: "saved annually via reconciliation" },
  { value: "9+ yrs", label: "building data platforms" },
];

export const projects: Project[] = [
  {
    slug: "pipeline-cost-redesign",
    title: "Data Pipeline Cost Redesign",
    domain: "Cost Engineering",
    metric: "$40K → <$100",
    metricLabel: "annual pipeline cost",
    technologies: ["Databricks", "PySpark", "Delta Lake", "Lakeflow Jobs"],
    summary: "Re-architected a costly analytics pipeline and cut its annual run cost by more than 99% within 100 days.",
    challenge: "Dashboards depended on pipelines that cost roughly $40K a year to run, and the business could not afford downtime while they were being changed.",
    approach: "Analysed where compute and storage were being spent, redesigned the architecture around incremental processing, and tuned pipeline execution. Changes were rolled out side by side so reporting stayed available.",
    impact: "Annual pipeline cost fell from $40K to under $100 in 100 days, with zero dashboard downtime.",
    decisions: [
      "Process only changed data instead of full reloads",
      "Right-size and schedule compute to the actual workload",
      "Cut over behind the existing dashboards to avoid downtime",
    ],
    diagram: "pipeline-cost-redesign.svg",
    snippet: {
      title: "Incremental watermark merge instead of full table reload",
      language: "python",
      body: `from delta.tables import DeltaTable
from pyspark.sql import functions as F

target = DeltaTable.forPath(spark, curated_path)
last_watermark = spark.read.parquet(state_path).select(F.max("updated_at")).first()[0]

incremental = (
    spark.read.format("delta").load(landing_path)
    .filter(F.col("updated_at") > F.lit(last_watermark))
)

(target.alias("t")
    .merge(incremental.alias("s"), "t.record_id = s.record_id")
    .whenMatchedUpdateAll()
    .whenNotMatchedInsertAll()
    .execute())`,
    },
  },
  {
    slug: "billing-reconciliation",
    title: "Billing Data Reconciliation",
    domain: "Revenue Assurance",
    metric: "£100K",
    metricLabel: "saved every year",
    technologies: ["Databricks", "PySpark", "REST APIs", "Delta Lake"],
    summary: "Reconciled billing data across commercial systems to expose unbilled revenue.",
    challenge: "Billing data lived in a vendor platform while commercial records sat in CRM, ERP, marketplace and partner files. Revenue leaked wherever the sources disagreed.",
    approach: "Ingested billing data through APIs into Databricks and matched it against CRM, ERP, marketplace and partner datasets to surface items that were delivered but never billed.",
    impact: "Exposed unbilled amounts and saved roughly £100K annually.",
    decisions: [
      "Land every source in raw Delta tables before matching",
      "Keep match rules explicit so finance can audit them",
      "Publish exceptions as a reviewable dataset, not a one-off report",
    ],
    diagram: "billing-reconciliation.svg",
    snippet: {
      title: "Multi-source anti-join to flag active but unbilled identifiers",
      language: "python",
      body: `from pyspark.sql import functions as F

provisioned = (
    crm_services.unionByName(marketplace_subs, allowMissingColumns=True)
    .filter(F.col("status") == "ACTIVE")
    .withColumn("norm_id", F.regexp_replace(F.col("service_identifier"), r"\\D", ""))
)

billed = billing_usage.withColumn(
    "norm_id", F.regexp_replace(F.col("billed_identifier"), r"\\D", "")
)

unbilled_exceptions = (
    provisioned.join(billed, on="norm_id", how="left_anti")
    .withColumn("detected_at", F.current_date())
)
unbilled_exceptions.write.format("delta").mode("overwrite").saveAsTable("audit.unbilled_services")`,
    },
  },
  {
    slug: "legacy-etl-modernization",
    title: "Legacy SSIS to Spark Modernization",
    domain: "Platform Engineering",
    metric: "14h → 10 min",
    metricLabel: "pipeline runtime",
    technologies: ["PySpark", "Spark SQL", "AWS EMR", "Redshift"],
    summary: "Refactored a long-running SSIS pipeline into optimized Spark jobs.",
    challenge: "A complex, SQL-heavy SSIS pipeline took 14 hours to finish, delaying data availability and slowing engineering delivery.",
    approach: "Untangled the transformation logic, rewrote it as partition-aware Spark jobs, and tuned joins, caching and execution plans for cloud-scale processing.",
    impact: "Runtime dropped from 14 hours to 10 minutes. The work earned a Star of the Quarter recognition.",
    decisions: [
      "Translate business rules first, then optimize, so results stay identical",
      "Partition by the dominant join keys to avoid wide shuffles",
      "Validate every output against the legacy result before cut-over",
    ],
    diagram: "legacy-etl-modernization.svg",
    snippet: {
      title: "Broadcast the small side, repartition the large one",
      language: "python",
      body: `from pyspark.sql import functions as F

orders = spark.read.parquet(orders_path)
customers = spark.read.parquet(customers_path)

# Avoid a shuffle join: the dimension is small enough to broadcast.
enriched = (
    orders
    .repartition("order_date")
    .join(F.broadcast(customers), "customer_id", "left")
    .cache()
)

daily = enriched.groupBy("order_date", "region").agg(
    F.sum("amount").alias("revenue"),
    F.countDistinct("customer_id").alias("customers"),
)
daily.write.mode("overwrite").partitionBy("order_date").parquet(out_path)`,
    },
  },
  {
    slug: "api-to-lake-scd2",
    title: "Regulated API to Lake with SCD Type 2",
    domain: "Pharma Data Platform",
    metric: "98%",
    metricLabel: "data accuracy",
    technologies: ["PySpark", "AWS Lambda", "EMR", "S3", "Redshift"],
    summary: "A Lambda and EMR pipeline that ingests a life-sciences CRM API into S3 and Redshift with full change history.",
    challenge: "GxP-regulated reporting needed every change to source records to be traceable, and the API delivered data as compressed packages that had to be tracked end to end.",
    approach: "Two Lambdas orchestrate and monitor runs while an EMR Spark job fetches, normalizes and curates data in two phases. Run state lives in Postgres, credentials in Secrets Manager, and curated layers carry SCD Type 2 history.",
    impact: "Delivered 98% data accuracy with lineage tracking and a repeatable Raw to Landing to Curated layout.",
    decisions: [
      "Orchestrator and monitor Lambdas stay thin; Spark does the heavy work",
      "A run manifest records every package so reruns are idempotent",
      "Deletes and type casting are handled in the curate phase, not at source",
    ],
    diagram: "api-to-lake-scd2.svg",
    snippet: {
      title: "SCD Type 2 close-and-insert pattern",
      language: "python",
      body: `from pyspark.sql import functions as F

changed = incoming.alias("n").join(
    current.alias("c"), "business_key"
).where(F.col("n.row_hash") != F.col("c.row_hash"))

# 1) expire the old version
expired = (changed.select("c.*")
    .withColumn("valid_to", F.current_timestamp())
    .withColumn("is_current", F.lit(False)))

# 2) open the new version
opened = (changed.select("n.*")
    .withColumn("valid_from", F.current_timestamp())
    .withColumn("valid_to", F.lit(None).cast("timestamp"))
    .withColumn("is_current", F.lit(True)))

result = unchanged.unionByName(expired).unionByName(opened)`,
    },
  },
  {
    slug: "multi-source-api-ingestion",
    title: "Multi-Source API Ingestion Platform",
    domain: "Data Integration",
    metric: "90%",
    metricLabel: "less manual data prep",
    technologies: ["Airflow (MWAA)", "Apache NiFi", "S3", "Glue", "Athena"],
    summary: "One ingestion platform for contracts, HR, survey, ticketing and document sources.",
    challenge: "Every new enterprise API arrived with nested JSON and its own authentication, so each source needed bespoke preparation before analysts could use it.",
    approach: "Built a shared platform on Airflow, NiFi, S3, Glue and Athena, with reusable PySpark JSON-flattening utilities, token handling with retries, and incremental loads.",
    impact: "Reusable flattening utilities eliminated about 90% of manual data preparation, and a config-driven NiFi framework cut pipeline maintenance by 80%.",
    decisions: [
      "Describe each source in config; reuse the same code path",
      "Flatten nested JSON generically instead of per-source parsers",
      "Retry authentication with backoff and fail loudly after the limit",
    ],
    diagram: "multi-source-api-ingestion.svg",
    snippet: {
      title: "Authenticated request with bounded retries",
      language: "python",
      body: `import time
import requests

def get_token(cfg, retries=5, wait=5):
    for attempt in range(1, retries + 1):
        resp = requests.post(cfg["token_url"], data=cfg["payload"], timeout=30)
        if resp.status_code == 200:
            return {"Authorization": f"Bearer {resp.json()['access_token']}"}
        time.sleep(wait * attempt)  # linear backoff
    raise RuntimeError(f"Token request failed after {retries} attempts")`,
    },
  },
  {
    slug: "metadata-driven-ingestion",
    title: "Metadata-Driven Ingestion and Data Quality",
    domain: "Data Governance",
    metric: "70%",
    metricLabel: "faster pipeline setup",
    technologies: ["PySpark", "AWS EventBridge", "S3", "Data Quality"],
    summary: "A reusable ingestion layer where schema, typing and quality checks come from metadata.",
    challenge: "Onboarding new sources was slow, and silent schema changes created downstream reporting risk.",
    approach: "Built metadata-driven schema enforcement, strongly typed transformations and automated data quality checks, triggered by EventBridge when files land.",
    impact: "Pipeline setup time fell 70%, and schema drift became visible at the landing boundary instead of in dashboards.",
    decisions: [
      "Schemas and checks live in metadata tables, not in code",
      "Validate at landing, before data reaches consumers",
      "Quarantine bad records with a reason instead of failing the run",
    ],
    diagram: "metadata-driven-ingestion.svg",
    snippet: {
      title: "Enforce a schema from metadata",
      language: "python",
      body: `from pyspark.sql import functions as F

def enforce_schema(df, columns):
    """columns: list of {"name": str, "type": str, "nullable": bool}"""
    missing = [c["name"] for c in columns if c["name"] not in df.columns]
    if missing:
        raise ValueError(f"Schema drift, missing columns: {missing}")

    typed = df.select(*[F.col(c["name"]).cast(c["type"]) for c in columns])
    for c in columns:
        if not c["nullable"]:
            typed = typed.filter(F.col(c["name"]).isNotNull())
    return typed`,
    },
  },
  {
    slug: "private-llm-billing-reconciliation",
    title: "Private LLM for Billing Analysis",
    domain: "Applied AI",
    metric: "R&D",
    metricLabel: "work in progress",
    status: "In progress / R&D",
    technologies: ["PySpark", "Databricks", "Local LLM"],
    summary: "Exploring a privately hosted language model to assist billing-data analysis without sending data to a public endpoint.",
    challenge: "Billing analysis could benefit from richer language-based reasoning, but commercial data must stay inside a controlled environment.",
    approach: "Prototyping a Spark-based workflow around a locally hosted language model for reconciliation-oriented analysis.",
    impact: "Still under development. No results are claimed yet.",
    decisions: [
      "Keep data inside a controlled environment",
      "Treat model output as a suggestion that analysts verify",
    ],
    diagram: "private-llm.svg",
  },
];

export type Role = {
  title: string;
  company: string;
  period: string;
  context?: string;
  bullets: string[];
};

export const experience: Role[] = [
  {
    title: "Lead Data Engineer",
    company: "Potentiam Ltd (client: a UK managed-services group)",
    period: "May 2026 – Present",
    bullets: [
      "Cut annual data pipeline costs from $40K to under $100 within 100 days, with zero dashboard downtime.",
      "Reconciled billing data across commercial systems in Databricks, exposing unbilled amounts and saving £100K annually.",
      "Integrated contact-centre analytics into the enterprise platform through API-based Databricks pipelines.",
    ],
  },
  {
    title: "Senior Data Engineer | Module Lead",
    company: "Visionet Systems (client: a global pharmaceutical company)",
    period: "May 2022 – May 2026",
    context: "Enterprise data platform for GxP-regulated workflows and compliance reporting.",
    bullets: [
      "Architected PySpark pipelines from life-sciences APIs into S3 and Redshift with SCD Type 2 lineage, delivering 98% data accuracy.",
      "Delivered a multi-source API ingestion platform on Airflow, NiFi, S3, Glue and Athena; reusable JSON-flattening utilities removed 90% of manual preparation.",
      "Built a metadata-driven ingestion layer with schema enforcement and automated quality checks, cutting pipeline setup time by 70%.",
      "Engineered a config-driven NiFi framework, lowering maintenance overhead by 80%.",
      "Modernized legacy SSIS ETL, compressing runtime from 14 hours to 10 minutes.",
      "Directed Spark optimization and cloud-native architecture, cutting release delays by 50%.",
    ],
  },
  {
    title: "Senior Application Engineer",
    company: "Whitehat Education",
    period: "July 2020 – May 2022",
    bullets: [
      "Migrated analytical workloads from MySQL to Amazon Redshift, saving 20% on infrastructure and improving query performance.",
      "Built A/B testing pipelines across WhatsApp, email and SMS, speeding campaign decisions by 50%.",
      "Unified communication pipelines serving 10,000+ daily active users, improving class joining by 25%.",
      "Mentored 4 data engineers through code reviews and CI/CD standards, sustaining 98% on-time delivery.",
    ],
  },
  {
    title: "IT Operations Associate (Data Analytics & SQL Reporting)",
    company: "Amazon Development Center India",
    period: "July 2016 – February 2019",
    bullets: [
      "Built SQL workforce analytics on large operational datasets, improving reporting efficiency by 30%.",
      "Partnered with engineering to fix recurring data quality issues, reducing repeat defects by 40%.",
    ],
  },
];

export const skillGroups = [
  { name: "Languages", items: ["PySpark", "Spark SQL", "Python", "SQL"] },
  { name: "Processing", items: ["Apache Spark", "Databricks", "Delta Lake", "Lakeflow", "CDC", "SCD Type 2", "Data Quality"] },
  { name: "AWS", items: ["S3", "EMR", "Glue", "Athena", "Redshift", "Lambda"] },
  { name: "Azure", items: ["ADLS Gen2", "Azure Data Factory", "Azure Databricks"] },
  { name: "Architecture", items: ["Lakehouse", "Medallion", "Dimensional Modeling", "Star Schema"] },
  { name: "Orchestration & DevOps", items: ["Airflow (MWAA)", "Apache NiFi", "Git", "Jenkins", "CloudWatch"] },
  { name: "Integration", items: ["REST APIs", "JSON", "Parquet"] },
  { name: "Databases", items: ["Redshift", "PostgreSQL", "MySQL", "Oracle", "MS SQL"] },
];

export const certifications = [
  "Big Data Certification, IIT Roorkee (2020)",
  "Apache Spark Programming (2023)",
  "Python Bootcamp (2019)",
  "Generative AI Foundation (2024)",
];

export const achievements = [
  "Client Appreciation: recognised for on-time delivery of enterprise data pipelines.",
  "Star of the Quarter: led platform modernization that cut legacy runtimes by up to 90%.",
  "Star Performer: optimized Redshift communication pipelines, lifting class joining by 25%.",
];

export const education = "B.Sc. Computer Science, Osmania University (2013 – 2016)";
