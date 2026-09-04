<?php
// QueryBuilder.php (Updated with update and delete methods)
class QueryBuilder {
    protected string $table;
    protected array $wheres = [];
    protected array $bindings = [];
    protected string $columns = '*';

    public function __construct(string $table) {
        $this->table = $table;
    }

    public function select(string $columns): self {
        $this->columns = $columns;
        return $this;
    }

    public function where(string $column, mixed $operator, mixed $value = null): self {
        if ($value === null) {
            $value = $operator;
            $operator = '=';
        }

        $this->wheres[] = "{$column} {$operator} ?";
        $this->bindings[] = $value;

        return $this;
    }

    public function toSql(): string {
        $sql = "SELECT {$this->columns} FROM {$this->table}";

        if (!empty($this->wheres)) {
            $sql .= " WHERE " . implode(' AND ', $this->wheres);
        }

        return $sql;
    }

    public function get(): array {
        $stmt = DB::getPdo()->prepare($this->toSql());
        $stmt->execute($this->bindings);
        return $stmt->fetchAll();
    }

    public function first(): mixed {
        $results = $this->get();
        return $results[0] ?? null;
    }

    public function insert(array $data): bool {
        $keys = array_keys($data);
        $columns = implode(', ', $keys);
        $placeholders = implode(', ', array_fill(0, count($data), '?'));

        $sql = "INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})";

        $stmt = DB::getPdo()->prepare($sql);
        return $stmt->execute(array_values($data));
    }

    public function update(array $data): bool {
        $fields = [];
        foreach (array_keys($data) as $key) {
            $fields[] = "{$key} = ?";
        }
        $fieldsSql = implode(', ', $fields);

        $sql = "UPDATE {$this->table} SET {$fieldsSql}";

        // Merge data values and existing where bindings
        $bindings = array_merge(array_values($data), $this->bindings);

        if (!empty($this->wheres)) {
            $sql .= " WHERE " . implode(' AND ', $this->wheres);
        }

        $stmt = DB::getPdo()->prepare($sql);
        return $stmt->execute($bindings);
    }

    public function delete(): bool {
        $sql = "DELETE FROM {$this->table}";

        if (!empty($this->wheres)) {
            $sql .= " WHERE " . implode(' AND ', $this->wheres);
        }

        $stmt = DB::getPdo()->prepare($sql);
        return $stmt->execute($this->bindings);
    }
}
